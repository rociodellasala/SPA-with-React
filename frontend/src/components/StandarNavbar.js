import React from 'react';
import { withRouter } from "react-router";
import '../css/Navbar.css';
import logo from '../resources/Logo4.png';
import {Link} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Button, Col } from 'react-bootstrap';
import * as axiosRequest from '../util/axiosRequest'


class StandarNavbar extends React.Component {
    constructor(props){
        super(props)
    }

    showlogin(){
        let login = document.getElementById("sign-in");
        if(getComputedStyle(login, null).display === 'none')
            login.style.display = 'block'
        else
            login.style.display = 'none'
    }

    handleFormSubmit(event){
        let currentComponent = this;
        let currentPath = this.props.location;
        event.preventDefault();
        axiosRequest.login(event.target[0].value,event.target[1].value).then(function(){
            currentComponent.props.rerenderParentCallback();
            currentComponent.props.history.push(currentPath)
        })
    }


    render(){
        const { t } = this.props;
        const schema = yup.object({
            email: yup.string().required( t('errors.requiredField') ).min( t('errors.shortMin') ),
            password: yup.string().required( t('errors.requiredField') ),
            });
        return(
                <nav>
                    <Link to={{pathname: "/"}}>
                    <a>
                        <img src={logo} alt="Home" id="logo"/>
                    </a>
                    </Link>
                    <div className="dropdown">
                        <a className="navbar_item" onClick={this.showlogin} href="#">{t('navbar.signIn')}</a>
                            <div className="dropdown-content-p dropdown-padding get-this" id="sign-in">
                                <Formik
                                    validationSchema={schema}
                                    >
                                    {({
                                        values,
                                        touched,
                                        errors,
                                    }) => (
                                    <Form noValidate onSubmit={event => {
                                            this.handleFormSubmit(event)
                                    }}>
                                        <Form.Group as={Col} md="12" controlId="validationFormik01">
                                            <Form.Label>{t('signUp.firstName')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="email"
                                                placeholder={t('login.emailHolder')}
                                                value={values.email}
                                                id="email"
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="12" controlId="validationFormik02">
                                            <Form.Label>{t('login.password')}</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder={t('login.passwordHolder')}
                                                name="password"
                                                isInvalid={!!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    <Button type="submit">{t('signUp.submit')}</Button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                <div>
                    <Link to={{pathname: "/SignUp"}}>
                        <a className="navbar_item" id="sign_up" href="./SignUp">{t('navbar.signUp')}</a>
                    </Link>
                </div>
            </nav>
        )
    }

}

export default withRouter(withTranslation()(StandarNavbar));