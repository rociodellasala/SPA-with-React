import React from 'react';
import {withTranslation} from 'react-i18next';
import {withRouter} from 'react-router';
import nextArrow from '../resources/arrow_right.png';
import previousArrow from '../resources/arrow_left.png';
import heartFilled from '../resources/heart_filled.png';
import heartEmpty from '../resources/heart.png';
import * as utilFunction from '../util/function';
import PublicationService from '../services/PublicationService';
import UserService from '../services/UserService';
import defaultImage from '../resources/default.jpg';
import * as StatusCode from '../util/StatusCode';
import ErrorService from '../services/ErrorService';
import LocalStorageService from '../services/LocalStorageService';
import CancelTokenService from '../services/CancelRequestService';

class ImageVisualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			isFavourite: null,
		};
		this.addFavourite = this.addFavourite.bind(this);
		this.removeFavourite = this.removeFavourite.bind(this);
	}

	componentDidMount() {
		if (UserService.isLogged()) {
			this.setState({
				isFavourite: this.props.isFavourite,
			});
		}
		if (this.props.maxImages !== null && this.props.maxImages !== undefined && this.props.maxImages !== 0)
			this.updateImage(this.state.index);
		else this.setDefaultImage();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.publicationid !== prevProps.publicationid) {
			this.setState({
				index: 0,
				isFavourite: this.props.isFavourite,
			});
			if (this.props.maxImages !== null && this.props.maxImages !== undefined && this.props.maxImages !== 0)
				this.updateImage(0);
			else this.setDefaultImage();
		}
	}

	setDefaultImage() {
		let id = this.props.page + this.props.publicationid;
		let img = document.getElementById(id);
		img.src = defaultImage;
		this.setState({
			index: 0,
		});
		this.incrementCounter();
	}

	updateImage(newIndex) {
		let currentComponent = this;
		let id = this.props.page + this.props.publicationid;
		let img = document.getElementById(id);
		let queryParameters = {};
		queryParameters.index = newIndex;
		PublicationService.getImage(this.props.publicationid, queryParameters, this.props).then(function(response) {
			if (CancelTokenService.isCancel(response)) return;
			if (response.status !== StatusCode.OK) {
				ErrorService.logError(currentComponent.props, response);
				return;
			}
			img.src = utilFunction.setSRC(response.data);
			currentComponent.setState({
				index: newIndex,
			});
			currentComponent.incrementCounter();
		});
	}

	getNextImage = () => {
		let currentIndex = this.state.index;
		let nextIndex;

		if (currentIndex + 1 === this.props.maxImages) nextIndex = 0;
		else nextIndex = currentIndex + 1;

		this.updateImage(nextIndex);
	};

	getPreviousImage = () => {
		let currentIndex = this.state.index;
		let previousIndex;

		if (currentIndex - 1 < 0) previousIndex = this.props.maxImages - 1;
		else previousIndex = currentIndex - 1;

		this.updateImage(previousIndex);
	};

	getFavouriteState() {
		let favIcon;
		if (this.state.isFavourite) {
			if (this.props.page !== 'MyFavorites')
				favIcon = (
					<input
						className='favorite-icon'
						id={'favourite-' + this.props.publicationid}
						type='image'
						src={heartFilled}
						alt='Fave'
						onClick={this.removeFavourite}
					/>
				);
			else
				favIcon = (
					<input
						className='favorite-icon'
						id={'favourite-' + this.props.publicationid}
						type='image'
						src={heartFilled}
						alt='Fave'
						onClick={() => this.props.showModal(this.props.publicationid)}
					/>
				);
		} else if (this.state.isFavourite === false)
			favIcon = (
				<input
					className='favorite-icon'
					id={'favourite-' + this.props.publicationid}
					type='image'
					src={heartEmpty}
					alt='Fave'
					onClick={this.addFavourite}
				/>
			);
		return favIcon;
	}

	addFavourite() {
		let currentComponent = this;
		let userid = LocalStorageService.getUserid();
		let favPublicationDTO = {};
		let favIcon = document.getElementById('favourite-' + this.props.publicationid);
		favIcon.disabled = true;
		favPublicationDTO.publicationid = this.props.publicationid;
		currentComponent.setState({isFavourite: true});
		UserService.addFavourite(userid, favPublicationDTO).then(function(response) {
			favIcon.disabled = false;
			if (response.status !== StatusCode.CREATED) {
				ErrorService.logError(currentComponent.props, response);
				return;
			}
		});
	}

	removeFavourite() {
		let currentComponent = this;
		let userid = LocalStorageService.getUserid();
		let publicationid = this.props.publicationid;
		let favIcon = document.getElementById('favourite-' + this.props.publicationid);
		favIcon.disabled = true;
		currentComponent.setState({isFavourite: false});
		UserService.removeFavourite(userid, publicationid).then(function(response) {
			favIcon.disabled = false;
			if (response.status !== StatusCode.NO_CONTENT) {
				ErrorService.logError(currentComponent.props, response);
				return;
			}
		});
	}

	incrementCounter() {
		let currentComponent = this;
		setTimeout(function() {
			LocalStorageService.incrementCounter();
			currentComponent.props.setReady();
		}, this.props.index);
	}

	componentWillUnmount() {
		CancelTokenService.getSource().cancel();
		CancelTokenService.refreshToken();
	}

	render() {
		let price;
		let favIcon = this.getFavouriteState();
		if (this.props.price != null) {
			price = <h2 className='price-tag'>U$S {this.props.price}</h2>;
		}

		return (
			<div className={this.props.containerClass}>
				<img className={this.props.imageClass} alt='img' id={this.props.page + this.props.publicationid} />
				{favIcon}
				{this.props.maxImages !== 0 ? (
					<>
						<img
							className={this.props.previousClass}
							src={previousArrow}
							alt='Previous'
							onClick={() => this.getPreviousImage()}
						/>
						<img
							className={this.props.nextClass}
							src={nextArrow}
							alt='Next'
							onClick={() => this.getNextImage()}
						/>
					</>
				) : null}

				{price}
			</div>
		);
	}
}

export default withRouter(withTranslation()(ImageVisualizer));
