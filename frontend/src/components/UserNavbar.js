import React from 'react';
import logo from '../resources/Logo4.png';
import {Link} from 'react-router-dom';
import { withTranslation, setDefaults } from 'react-i18next';

class UserNavbar extends React.Component {

    constructor(props) {
         super(props);
         this.state = {

         };
       }


    render(){
        return(
            <nav>
                <Link to={{pathname: "/"}}>
                    <a href="">
                        <img src={logo} alt="Home" id="logo"/>
                    </a>
                </Link>
            </nav>
        )
    }

}

export default withTranslation()(UserNavbar);