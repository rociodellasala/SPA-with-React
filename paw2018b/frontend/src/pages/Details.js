import React from 'react';
import {withTranslation} from 'react-i18next';
import {withRouter} from 'react-router';
import {Form, Button, Col} from 'react-bootstrap';
import {Formik} from 'formik';
import ColoredLinearProgress from '../components/ColoredLinearProgress';
import ColoredCircularProgress from '../components/ColoredCircularProgress';
import ToastNotification from '../components/ToastNotification';
import ImageVisualizer from '../components/ImageVisualizer';
import MapContainer from '../components/MapContainer';
import credentials from '../components/credentials';
import PublicationService from '../services/PublicationService';
import LocalStorageService from '../services/LocalStorageService';
import UserService from '../services/UserService';
import JsonService from '../services/JsonService';
import ErrorService from '../services/ErrorService';
import CancelTokenService from '../services/CancelRequestService';
import * as yup from 'yup';
import * as Constants from '../util/Constants';
import * as StatusCode from '../util/StatusCode';
import 'toasted-notes/src/styles.css';
import '../css/Details.css';


const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${credentials.mapsKey}`;

class Details extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			code: null,
			publication: null,
			loading: false,
			circleloading: false,
			showModal: false
		};
		this.setReady = this.setReady.bind(this);
	}

	static defaultProps = {
		center: {lat: 40.73, lng: -73.93},
		zoom: 12,
	};

	componentDidMount() {
		const queryString = require('query-string');
		const query = queryString.parse(this.props.location.search);
		const currentComponent = this;
		LocalStorageService.initializeCounter()
		this.setState({
			circleloading: true,
		});
		PublicationService.getPublication(query.publicationid).then(function(response) {
			if (CancelTokenService.isCancel(response)) return;
			if (response.status !== StatusCode.OK) {
				ErrorService.logError(currentComponent.props, response);
				return;
			}
			currentComponent.setState({
				publication: response.data,
				circleloading: false,
			});
		});
	}

	handleSendMessage(event, errors) {
		event.preventDefault();
		let currentComponent = this;

		let ownerEmail = this.state.publication.userEmail;
		let title = this.state.publication.title;
		let emailDTO = JsonService.getJSONParsed(event.target);
		emailDTO.ownerEmail = ownerEmail;
		emailDTO.title = title;
		if (Object.keys(errors).length === 0) {
			this.setState({
				loading: true,
				showModal: false,
			});

			UserService.sendMessage(emailDTO).then(function(response) {
				if (response.status !== StatusCode.CREATED) {
					ErrorService.logError(currentComponent.props, response);
					return;
				}
				currentComponent.setState({
					loading: false,
					showModal: true, 
				});
				
			});
		}
	}

	setReady() {
		this.setState({circleloading: false, showModal: false});
		LocalStorageService.deleteCounter()
	}

	componentWillUnmount() {
		CancelTokenService.getSource().cancel();
		CancelTokenService.refreshToken();
		LocalStorageService.deleteCounter()
	}

	render() {
		const {t} = this.props;
		const queryString = require('query-string');
		const query = queryString.parse(this.props.location.search);
		const schema = yup.object({
			name: yup
				.string()
				.required(t('errors.requiredField'))
				.matches(Constants.lettersAndSpacesRegex, t('errors.lettersAndSpacesRegex'))
				.min(Constants.SHORT_STRING_MIN_LENGTH, t('errors.lengthMin'))
				.max(Constants.SHORT_STRING_MAX_LENGTH, t('errors.lengthMax')),
			email: yup
				.string()
				.required(t('errors.requiredField'))
				.matches(Constants.emailRegex, t('errors.emailRegex'))
				.min(Constants.SHORT_STRING_MIN_LENGTH, t('errors.lengthMin'))
				.max(Constants.EMAIL_MAX_LENGTH, t('errors.lengthMax')),
			message: yup
				.string()
				.required(t('errors.requiredField'))
				.matches(Constants.descriptionRegex, t('errors.descriptionRegex'))
				.min(Constants.SECOND_FORM_MIN_LENGTH, t('errors.lengthMin'))
				.max(Constants.SECOND_FORM_MAX_LENGTH, t('errors.lengthMax')),
		});

		return (
			<div>
				<ToastNotification
					show={this.state.showModal}
					title={t('details.messageTitle')}
					information={t('details.messageDetail')}
					type='Information'
					checkModal={false}
					specialCloseModal={false}
				/>
				{this.state.loading ? <ColoredLinearProgress /> : null}
				{this.state.circleloading || this.state.publication === null ? (
					<ColoredCircularProgress />
				) : (
					<div>
						<div id='cols'>
							<div id='left-col'>
								<div className='polaroid-details'>
									<ImageVisualizer
										publicationid={query.publicationid}
										maxImages={this.state.publication.images}
										isFavourite={this.state.publication.favourite}
										page='Details'
										imageClass='imageSize'
										containerClass='img-with-tag mySlides'
										nextClass='next-image-details pointer centerArrow'
										previousClass='prev-image-details pointer centerArrow'
										setReady={this.setReady}
										index={0}
									/>
									<div className='container-list'>
										<p className='direction'>
											{this.state.publication.address},{this.state.publication.neighborhoodid},{' '}
											{this.state.publication.cityid},{this.state.publication.provinceid}
										</p>
									</div>
								</div>

								<div className='polaroid_overview'>
									<div className='container4'>
										<p className='polaroid_title'>{t('details.overview')}</p>
										<p className='agency_text'>
											{t('details.bedrooms')} {this.state.publication.bedrooms}
										</p>
										<p className='agency_text'>
											{t('details.bathrooms')} {this.state.publication.bathrooms}
										</p>
										<p className='agency_text'>
											{t('details.floorSize')} {this.state.publication.dimention} m2
										</p>
										{this.state.publication.coveredFloorSize === '-1' ? null : (
											<p className='agency_text'>
												{t('details.coveredFloorSize')} {this.state.publication.coveredFloorSize + ' m2'}
											</p>
										)}
										<p className='agency_text'>
											{t('details.parking')} {this.state.publication.parking}
										</p>
										{this.state.publication.balconies === '-1' ? null : (
											<p className='agency_text'>
												{t('details.balconies')} {this.state.publication.balconies}
											</p>
										)}
										{this.state.publication.amenities === '-1' ? null : (
											<p className='agency_text'>
												{t('details.amenities')} {this.state.publication.amenities}
											</p>
										)}
										{this.state.publication.storage === '-1' ? null : (
											<p className='agency_text'>
												{t('details.storage')}{' '}
												{this.state.publication.storage === 'yes' ? t('details.Yes') : t('details.No')}
											</p>
										)}
										{this.state.publication.expenses === '-1' ? null : (
											<p className='agency_text'>
												{t('details.expenses')} {this.state.publication.expenses + ' U$S'}
											</p>
										)}
									</div>
								</div>
							</div>

							<div id='right-col'>
								<div className='polaroid_price'>
									<div className='container2'>
										<div className='price_text'>
											<p id='rent_sale'>{t('details.price')} </p>
											<p id='price_tag'>U$S {this.state.publication.price}</p>
										</div>
									</div>
								</div>

								<div className='polaroid_agency'>
									<div className='container3'>
										<p className='agency_text_contact'>{t('details.contact')}</p>
										<div id='tel-container'>
											<p className='tel-text'>{t('details.phoneNumber')}</p>
											<p className='tel-num'>{this.state.publication.phoneNumber}</p>
										</div>
										<div className='fillers'>
											<Formik
												validationSchema={schema}
												initialValues={{name: '', email: '', message: ''}}
												onSubmit={(values, {setSubmitting, resetForm}) => {
													setSubmitting(true);
													resetForm();
													setSubmitting(false);
												}}>
												{({
													values,
													errors,
													touched,
													handleChange,
													handleBlur,
													handleSubmit,
													isSubmitting,
												}) => (
													<Form
														noValidate
														id='messageForm'
														onSubmit={(event) =>
															handleSubmit(event) || this.handleSendMessage(event, errors)
														}>
														<Form.Group as={Col} md='12' controlId='validationFormik01'>
															<Form.Label bsPrefix='contact-title'>{t('details.name')}</Form.Label>
															<Form.Control
																type='input'
																placeholder={t('details.namePlaceholder')}
																value={values.name}
																onChange={handleChange}
																onBlur={handleBlur}
																name='name'
																isInvalid={!!errors.name && touched.name}
															/>
															<Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
														</Form.Group>
														<Form.Group as={Col} md='12' controlId='validationFormik02'>
															<Form.Label bsPrefix='contact-title'>{t('details.email')}</Form.Label>
															<Form.Control
																type='input'
																placeholder={t('details.emailPlaceholder')}
																onChange={handleChange}
																onBlur={handleBlur}
																name='email'
																value={values.email}
																isInvalid={!!errors.email && touched.email}></Form.Control>
															<Form.Control.Feedback type='invalid'>
																{errors.email}
															</Form.Control.Feedback>
														</Form.Group>
														<Form.Group as={Col} md='12' controlId='validationFormik03'>
															<Form.Label bsPrefix='contact-title'>{t('details.message')}</Form.Label>
															<Form.Control
																as='textarea'
																placeholder={t('details.messagePlaceholder')}
																name='message'
																onChange={handleChange}
																onBlur={handleBlur}
																value={values.message}
																isInvalid={!!errors.message && touched.message}></Form.Control>
															<Form.Control.Feedback type='invalid'>
																{errors.message}
															</Form.Control.Feedback>
														</Form.Group>
														<Button
															bsPrefix='button-contact'
															type='submit'
															id='submitButton'
															disabled={isSubmitting}
															onClick={handleChange}>
															{t('details.submit')}
														</Button>
													</Form>
												)}
											</Formik>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='bottom_container'>
							<div className='polaroid_des'>
								<div className='container-list'>
									<p className='polaroid_title'>{this.state.publication.title}</p>
									<p className='agency_text'>{this.state.publication.description}</p>
								</div>
							</div>
							<div className='polaroid_des'>
								<div className='container-list'>
									<p className='polaroid_title'>{t('details.location')}</p>
									<MapContainer
										address={this.state.publication.address}
										neighborhood={this.state.publication.neighborhoodid}
										city={this.state.publication.cityid}
										province={this.state.publication.provinceid}
										googleMapURL={mapURL}
										containerElement={<div style={{height: '300px'}} />}
										mapElement={<div style={{height: '100%'}} />}
										loadingElement={<p>t('details.loadingMap')</p>}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default withRouter(withTranslation()(Details));
