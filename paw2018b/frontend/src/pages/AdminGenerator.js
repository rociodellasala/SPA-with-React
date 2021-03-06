import React from 'react';
import {withRouter} from 'react-router';
import {withTranslation} from 'react-i18next';
import {Form, Button} from 'react-bootstrap';
import {Formik} from 'formik';
import {appendSelectElement} from '../util/function';
import ToastNotification from '../components/ToastNotification';
import AdminManagment from '../components/AdminManagment';
import ColoredLinearProgress from '../components/ColoredLinearProgress';
import LocationService from '../services/LocationService';
import ErrorService from '../services/ErrorService';
import JsonService from '../services/JsonService';
import CancelTokenService from '../services/CancelRequestService';
import * as StatusCode from '../util/StatusCode';
import * as yup from 'yup';
import * as Constants from '../util/Constants';
import '../css/AdminGenerator.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class AdminGenerator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			provinces: [],
			cities: [],
			neighborhoods: [],
			posting: false,
			showModal: false,
			titleModal: null,
			informationModal: null,
			typeModal: null,
		};
	}

	componentDidMount() {
		let currentComponent = this;
		LocationService.getProvinces().then(function(response) {
			if (CancelTokenService.isCancel(response)) return;
			if (response.status !== StatusCode.OK) {
				ErrorService.logError(currentComponent.props, response);
				return;
			}
			currentComponent.setState({
				provinces: response.data,
			});
		});
	}

	handleProvinceSubmit(event, errors) {
		event.preventDefault();
		let currentComponent = this;
		let province = event.target[0].value;
		let provinceDTO = JsonService.getJSONParsed(event.target);
		if (Object.keys(errors).length === 0) {
			this.setState({posting: true, showModal: false});
			LocationService.postProvince(provinceDTO).then(function(response) {
				currentComponent.setState({posting: false});
				if (response.status === StatusCode.CONFLICT) currentComponent.setModalError(province);
				else if (response.status === StatusCode.CREATED) {
					currentComponent.setModalInformation(province);
					LocationService.getProvinces(currentComponent.props).then(function(response) {
						if (CancelTokenService.isCancel(response)) return;
						currentComponent.setState({
							provinces: response.data,
						});
					});
				} else {
					ErrorService.logError(currentComponent.props, response);
				}
			});
		}
	}

	handleCitySubmit(event, errors) {
		event.preventDefault();
		let currentComponent = this;
		let city = event.target[1].value;
		let provinceid = event.target[0].value;
		let cityDTO = JsonService.getJSONParsed(event.target);
		if (Object.keys(errors).length === 0) {
			this.setState({posting: true, showModal: false});
			LocationService.postCity(provinceid, cityDTO).then(function(response) {
				currentComponent.setState({posting: false});
				if (response.status === StatusCode.CONFLICT) currentComponent.setModalError(city);
				else if (response.status === StatusCode.CREATED) currentComponent.setModalInformation(city);
				else ErrorService.logError(currentComponent.props, response);
			});
		}
	}

	handleNeighborhoodSubmit(event, errors) {
		event.preventDefault();
		let currentComponent = this;
		let neighborhood = event.target[2].value;
		let cityid = event.target[1].value;
		let neighborhoodDTO = JsonService.getJSONParsed(event.target);
		if (Object.keys(errors).length === 0) {
			this.setState({posting: true, showModal: false});
			LocationService.postNeighborhood(cityid, neighborhoodDTO).then(function(response) {
				currentComponent.setState({posting: false});
				if (response.status === StatusCode.CONFLICT) currentComponent.setModalError(neighborhood);
				else if (response.status === StatusCode.CREATED) currentComponent.setModalInformation(neighborhood);
				else ErrorService.logError(currentComponent.props, response);
			});
		}
	}

	updateCity(event, values) {
		event.preventDefault();
		let currentComponent = this;
		values.provinceid = event.target.value;
		event.target.blur();
		let provinceid = event.target[0].parentElement.value;
		LocationService.getCities(provinceid).then(function(response) {
			if (CancelTokenService.isCancel(response)) return;
			if (response.status !== StatusCode.OK) {
				ErrorService.logError(currentComponent.props, response);
				return;
			}
			let select = document.getElementById('city_neighborhood');
			let cities = response.data;
			select.selectedIndex = 0;
			while (select.childNodes[1]) {
				select.removeChild(select.childNodes[1]);
			}
			for (let i = 0; i < cities.length; i++) {
				appendSelectElement(select, cities[i].city, cities[i].cityid);
			}
		});
	}

	updateProvinceValue(event, values) {
		event.preventDefault();
		values.provinceid = event.target.value;
		event.target.blur();
	}

	updateCityValue(event, values) {
		event.preventDefault();
		values.cityid = event.target.value;
		event.target.blur();
	}

	setModalInformation(location) {
		const {t} = this.props;
		this.setState({
			showModal: true,
			titleModal: t('modal.postLocation'),
			informationModal: t('modal.postLocationDetail', {location: location}),
			typeModal: 'Information',
		});
	}

	setModalError(location) {
		const {t} = this.props;
		this.setState({
			showModal: true,
			titleModal: t('modal.postLocationError'),
			informationModal: t('modal.postLocationDetailError', {location: location}),
			typeModal: 'Error',
		});
	}

	componentWillUnmount() {
		CancelTokenService.getSource().cancel();
		CancelTokenService.refreshToken();
	}

	render() {
		const {t} = this.props;
		const provinces = this.state.provinces.map(function(item) {
			return (
				<option value={item.provinceid} name='provinceid' key={item.provinceid}>
					{' '}
					{item.province}{' '}
				</option>
			);
		});
		const schemaProvince = yup.object({
			province: yup
				.string()
				.required(t('errors.requiredField'))
				.matches(Constants.lettesNumersAndSpacesRegex, t('errors.lettesNumersAndSpacesRegex'))
				.min(Constants.MIN_LOCATION_LENGTH, t('errors.lengthMin'))
				.max(Constants.MAX_LOCATION_LENGTH, t('errors.lengthMax')),
		});
		const schemacity = yup.object({
			provinceid: yup.string().required(t('errors.requiredField')),
			city: yup
				.string()
				.required(t('errors.requiredField'))
				.matches(Constants.lettesNumersAndSpacesRegex, t('errors.lettesNumersAndSpacesRegex'))
				.min(Constants.MIN_LOCATION_LENGTH, t('errors.lengthMin'))
				.max(Constants.MAX_LOCATION_LENGTH, t('errors.lengthMax')),
		});
		const schemaNeighborhood = yup.object({
			provinceid: yup.string().required(t('errors.requiredField')),
			cityid: yup.string().required(t('errors.requiredField')),
			neighborhood: yup
				.string()
				.required(t('errors.requiredField'))
				.matches(Constants.lettesNumersAndSpacesRegex, t('errors.lettesNumersAndSpacesRegex'))
				.min(Constants.MIN_LOCATION_LENGTH, t('errors.lengthMin'))
				.max(Constants.MAX_LOCATION_LENGTH, t('errors.lengthMax')),
		});

		return (
			<div>
				<AdminManagment t={t} active={'AdminGenerator'} />
				<ToastNotification
					show={this.state.showModal}
					title={this.state.titleModal}
					information={this.state.informationModal}
					type={this.state.typeModal}
					checkModal={false}
					specialCloseModal={false}
				/>
				{this.state.posting ? <ColoredLinearProgress /> : null}
				<div className='polaroid data create-locations'>
					<div className='title-container'>
						<h2>{t('admin.locationTitle')}</h2>
					</div>
					<fieldset className='signup-list-item'>
						<legend className='legendTag'>{t('admin.provinceLegend')}</legend>
						<Formik
							validationSchema={schemaProvince}
							initialValues={{province: ''}}
							onSubmit={(values, {setSubmitting, resetForm}) => {
								setSubmitting(true);
								resetForm();
								setSubmitting(false);
							}}>
							{({values, touched, errors, handleChange, handleSubmit, isSubmitting, handleBlur}) => (
								<Form
									noValidate
									className='form-inline'
									onSubmit={(event) => handleSubmit(event) || this.handleProvinceSubmit(event, errors)}>
									<Form.Group>
										<div>
											<Form.Label className='location-label'>{t('admin.province')}</Form.Label>
											<Form.Control
												type='text'
												name='province'
												className='location-input'
												placeholder={t('admin.provinceHolder')}
												value={values.province}
												onChange={handleChange}
												onBlur={handleBlur}
												isInvalid={!!errors.province && touched.province}
											/>
											<Form.Control.Feedback type='invalid'>{errors.province}</Form.Control.Feedback>
										</div>
										<Button
											type='submit'
											id='submitProvinceButton'
											className='signup-submit'
											disabled={isSubmitting}
											onClick={handleChange}>
											{t('admin.create')}
										</Button>
									</Form.Group>
								</Form>
							)}
						</Formik>
					</fieldset>
					<fieldset className='signup-list-item'>
						<legend className='legendTag'>{t('admin.cityLegend')}</legend>
						<Formik
							validationSchema={schemacity}
							initialValues={{provinceid: '', city: ''}}
							onSubmit={(values, {setSubmitting, resetForm}) => {
								setSubmitting(true);
								resetForm();
								setSubmitting(false);
							}}>
							{({values, touched, errors, handleChange, handleSubmit, handleBlur, isSubmitting}) => (
								<Form
									noValidate
									className='form-inline'
									onSubmit={(event) => handleSubmit(event) || this.handleCitySubmit(event, errors)}>
									<Form.Group>
										<div>
											<Form.Label className='location-label'>{t('admin.province')}</Form.Label>
											<Form.Control
												as='select'
												name='provinceid'
												className='location-select'
												value={values.provinceid}
												onChange={(event) => this.updateProvinceValue(event, values) && handleChange(event)}
												onBlur={handleBlur}
												isInvalid={!!errors.provinceid && touched.provinceid}>
												<option disabled defaultValue='' value=''>
													{t('publish.provinceHolder')}
												</option>
												{provinces}
											</Form.Control>
											<Form.Control.Feedback type='invalid'>{errors.provinceid}</Form.Control.Feedback>
										</div>
									</Form.Group>
									<Form.Group>
										<div>
											<Form.Label className='location-label'>{t('admin.city')}</Form.Label>
											<Form.Control
												type='text'
												name='city'
												className='location-input'
												placeholder={t('admin.cityHolder')}
												value={values.city}
												onChange={handleChange}
												onBlur={handleBlur}
												isInvalid={!!errors.city && touched.city}
											/>
											<Form.Control.Feedback type='invalid'>{errors.city}</Form.Control.Feedback>
										</div>
										<Button
											type='submit'
											id='submitCityButton'
											className='signup-submit'
											disabled={isSubmitting}
											onClick={handleChange}>
											{t('admin.create')}
										</Button>
									</Form.Group>
								</Form>
							)}
						</Formik>
					</fieldset>
					<fieldset className='signup-list-item'>
						<legend className='legendTag'>{t('admin.neighborhoodLegend')}</legend>
						<Formik
							validationSchema={schemaNeighborhood}
							initialValues={{provinceid: '', cityid: '', neighborhood: ''}}
							onSubmit={(values, {setSubmitting, resetForm}) => {
								setSubmitting(true);
								resetForm();
								setSubmitting(false);
							}}>
							{({values, touched, errors, handleChange, handleSubmit, handleBlur, isSubmitting}) => (
								<Form
									noValidate
									className='form-inline'
									onSubmit={(event) => handleSubmit(event) || this.handleNeighborhoodSubmit(event, errors)}>
									<Form.Group>
										<div>
											<Form.Label className='location-label'>{t('admin.province')}</Form.Label>
											<Form.Control
												as='select'
												name='provinceid'
												className='location-select'
												value={values.provinceid}
												onChange={(event) => this.updateCity(event, values) && handleChange(event)}
												onBlur={handleBlur}
												isInvalid={!!errors.provinceid && touched.provinceid}>
												<option disabled defaultValue='' value=''>
													{t('publish.provinceHolder')}
												</option>
												{provinces}
											</Form.Control>
											<Form.Control.Feedback type='invalid'>{errors.provinceid}</Form.Control.Feedback>
										</div>
									</Form.Group>
									<Form.Group>
										<div>
											<Form.Label className='location-label'>{t('admin.city')}</Form.Label>
											<Form.Control
												as='select'
												type='text'
												name='cityid'
												id='city_neighborhood'
												className='location-select'
												value={values.cityid}
												onBlur={handleBlur}
												onChange={(event) => this.updateCityValue(event, values) && handleChange(event)}
												isInvalid={!!errors.cityid && touched.cityid}>
												<option disabled defaultValue='' value=''>
													{t('publish.cityHolder')}
												</option>
											</Form.Control>
											<Form.Control.Feedback type='invalid'>{errors.cityid}</Form.Control.Feedback>
										</div>
									</Form.Group>
									<Form.Group>
										<div>
											<Form.Label className='location-label'>{t('admin.neighborhood')}</Form.Label>
											<Form.Control
												type='text'
												name='neighborhood'
												className='location-input'
												placeholder={t('admin.neighborhoodHolder')}
												value={values.neighborhood}
												onChange={handleChange}
												onBlur={handleBlur}
												isInvalid={!!errors.neighborhood && touched.neighborhood}
											/>
											<Form.Control.Feedback type='invalid'>{errors.neighborhood}</Form.Control.Feedback>
										</div>
										<Button
											type='submit'
											id='submitNeighborhoodButton'
											className='signup-submit'
											disabled={isSubmitting}
											onClick={handleChange}>
											{t('admin.create')}
										</Button>
									</Form.Group>
								</Form>
							)}
						</Formik>
					</fieldset>
				</div>
			</div>
		);
	}
}

export default withRouter(withTranslation()(AdminGenerator));
