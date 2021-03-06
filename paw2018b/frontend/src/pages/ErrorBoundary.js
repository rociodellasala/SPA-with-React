import React from 'react';
import {withTranslation} from 'react-i18next';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import '../css/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			coding: props.location.state.coding,
		};
	}

	render() {
		const {t} = this.props;
		var description;
		if (this.state.coding.toString().charAt(0) === '4') {
			description = t('errors.clientError');
		} else {
			description = t('errors.serverError');
		}
		var codeMsg = t('errors.errorCode') + this.state.coding + ' - ' + description;
		return (
			<div>
				<div id='error-container'>
					<h1 id='error-title'>{t('errors.errorTitle')}</h1>
					<p id='error-status'>{codeMsg}</p>
					<p id='error-message'>{t('errors.errorMessage')}</p>
				</div>
				<div id='link2-container'>
					<Link to={{pathname: '/'}}>
						<p id='error-link1'>{t('errors.errorBackHome')}</p>
					</Link>
				</div>
			</div>
		);
	}
}

export default withRouter(withTranslation()(ErrorBoundary));
