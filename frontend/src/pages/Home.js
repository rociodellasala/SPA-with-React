import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import '../css/home.css';
import ImgsViewer from 'react-images-viewer'
import image1 from '../resources/examples/1.jpg'
import image2 from '../resources/examples/2.jpg'
import HomeCard from '../components/HomeCard'
import {Link} from 'react-router-dom';
import PublicationService from '../services/PublicationService'
import * as Constants from '../util/Constants'
import * as StatusCode from '../util/StatusCode'
import ErrorService from '../services/ErrorService';
import ColoredCircularProgress from '../components/ColoredCircularProgress';

class HomeReal extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            publicationsSale: [],
            publicationsRent: [],
            search: "",
            operation: "FSale",
            propertyType: "House",
            circleloading: false
        };
      }
    
    componentDidMount(){
        let currentComponent = this
        let queryParameters_1 = {}
        let queryParameters_2 = {}
        this.setState({
            circleloading: true
        });
        queryParameters_1.operation = Constants.FSALE
        queryParameters_1.order = Constants.NEWEST_PUBLICATION
        PublicationService.getPublications(queryParameters_1).then(function (response){
            if(response.status !== StatusCode.OK){
                ErrorService.logError(currentComponent.props,response)
                return;
            }
            currentComponent.setState({
                publicationsSale: response.data,
                circleloading: false
            })
        })
        queryParameters_2.operation = Constants.FRENT
        queryParameters_2.order = Constants.NEWEST_PUBLICATION
        PublicationService.getPublications(queryParameters_2).then(function (response){
            if(response.status !== StatusCode.OK){
                ErrorService.logError(currentComponent.props,response)
                return;
            }
            currentComponent.setState({
                publicationsRent: response.data,
                circleloading: false
            })
        })
      }


    renderNewest(array, table) {
        if(array.length > 0) {
            const maxResults = 8;
            let loopEnd;
            if(maxResults > array.length) {
                loopEnd = array.length;
            } else {
                loopEnd = maxResults;
            }


            for(let i = 0; i < loopEnd; i ++) { 
                table.push(
                    <HomeCard publication={array[i]}/>
                )
            }
        }   
    }

    setOperation(operation){
        let buy = document.getElementById("buy")
        let rent = document.getElementById("rent")

        if(operation === Constants.FSALE){
            rent.classList.remove("selected")
            buy.classList.add("selected");
        }else{
            buy.classList.remove("selected")
            rent.classList.add("selected");
        }

        this.setState({
            operation: operation
        })
    }
    
    setPropertyType(event){
        this.setState({
            propertyType: event.target.value
        })
    }

    setSearch(){
        let value = document.getElementById("input_search").value
        this.setState({
            search: value
        })
    }

    render(){
        const { t } = this.props;
        let tableSale = [];
        let tableRent = [];
        this.renderNewest(this.state.publicationsSale, tableSale);
        this.renderNewest(this.state.publicationsRent, tableRent);
        return(
            <div>
            {this.state.circleloading ? 
                ( <ColoredCircularProgress /> )
               : (  
            <div>
                <header>
                <div className="header">
                    <div className="title">
                        <h1>{t('home.title')}</h1>
                    </div>
                    <form>
                    <div className="search_list">
                        <fieldset className="search_list-container rounded">
                                <div className="search_list-item selected" id="buy" onClick={() => this.setOperation("FSale")}>
                                    <input value="FSale" type="radio" /><label id="buy-label" >{t('home.buy')}</label>
                                </div>
                                <div className="search_list-item" id="rent" onClick={() => this.setOperation("FRent")}>
                                    <input value="FRent" type="radio" /><label id="rent-label">{t('home.rent')}</label>
                                </div>
                        </fieldset>
                    </div>
                    <div id="icons">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-8">
                                    <form id="card" className="card card-sm">
                                        <div className="card-body row no-gutters">
                                            <div className="col-auto">
                                                <i className="fas fa-search h4 text-body"></i>
                                            </div>
                                            <div className="col">
                                                <select className="type-home-select" onChange={(e) => this.setPropertyType(e)}>
                                                    <option value="House">{t('home.house')}</option>
                                                    <option value="Apartment">{t('home.apartment')}</option>
                                                </select>
                                                <input type="hidden" id="propertyType"/>
                                                <input  onChange={() => this.setSearch()}className="form-control form-control-lg" type="search" id="input_search" placeholder={t('home.search')}/>
                                            </div>
                                            <div className="col-auto">
                                                <Link to={{pathname: "/List", search: "?address=" + this.state.search + "&operation=" + this.state.operation + "&propertyType=" + this.state.propertyType}} >
                                                    <input id="searchbutton" className="btn btn-lg rounded" type="submit" value={t('home.searhBtn')}/>
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </header>
            <div>
            <section class="newest_homes">
                    <div>
                        <h3>{t('home.newPropsOnSale')}</h3>
                    </div>
                    <div>
                        <ul id="newest-homes-fsale" class="newest-homes-list">
                            {tableSale}
                        </ul>
                    </div>
            </section>
            <section class="newest_homes">
                    <div>
                        <h3>{t('home.newPropsOnRent')}</h3>
                    </div>
                    <div>
                        <ul id="newest-homes-fsale" class="newest-homes-list">
                            {tableRent}
                        </ul>
                    </div>
            </section>
            <ImgsViewer
                imgs={[{ src: image1 }, { src: image2 }]}
                isOpen={this.state.isOpen}
                onClickPrev={this.gotoPrevious}
                onClickNext={this.gotoNext}
                onClose={this.closeImgsViewer}
            />
            </div>
        </div>
            ) }
        </div>
        );
    }
}


export default withRouter(withTranslation()(HomeReal));