import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import ProfileAsideBar from '../components/ProfileAsideBar'
import Publication from '../components/Publication';
import UserService from '../services/UserService'
import PublicationService from '../services/PublicationService'
import ReactPaginate from 'react-paginate';
import ToastNotification from '../components/ToastNotification'
import * as Constants from '../util/Constants'
import LocalStorageService from '../services/LocalStorageService';
import * as StatusCode from '../util/StatusCode'
import ErrorService from '../services/ErrorService';
import PublicationLoader from '../components/PublicationLoader'

class MyPublications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPage: this.getInitialPage(),
            myPublicationsCounter: 0,
            myPublications: [],
            publicationIDToDelete: 0,
            page: 0,
            pagesQuantity: 0,
            showModal: false,
            loadingPublications: false,
        };

        this.showModalErasePublication = this.showModalErasePublication.bind(this);
        this.erasePublication = this.erasePublication.bind(this);
        this.setReady = this.setReady.bind(this)
    }

    componentDidMount() {
        this.updatePublications(this.state.page);
    }

    getInitialPage(){
        const params = new URLSearchParams(this.props.location.search); 
        const queryPageParam = params.get('page');
        return parseInt(queryPageParam) - 1 || 0;
    }

    pushPageParam(page){
        this.props.history.push({
            path: '/MyPublications',
            search: '?page=' + page
        })
    }

    handlePageClick = data => {
        this.updatePublications(data.selected)
    }

    updatePublications(page){
        let currentComponent = this; 
        let queryParameters = {}
        let userid;
        queryParameters.page = parseInt(page);
        queryParameters.limit = Constants.PUBLICATIONS_PAGE_LIMIT
        userid = LocalStorageService.getUserid();
        this.setState({loadingPublications: true})
        LocalStorageService.deleteCounter();
        LocalStorageService.initializeCounter()
        UserService.getMyPublications(userid,queryParameters).then(function(response) {
            if(response.status !== StatusCode.OK){
                ErrorService.logError(currentComponent.props,response)
                return
            }
            currentComponent.setState({
                myPublications: response.data,
                page: queryParameters.page,
                pagesQuantity: Math.ceil(response.headers["x-total-count"] / Constants.PUBLICATIONS_PAGE_LIMIT),
                myPublicationsCounter: response.headers["x-total-count"]
            })
            currentComponent.pushPageParam(queryParameters.page + 1);
        })
    }

    showModalErasePublication(publicationID){
        this.setState({
            showModal: true,
            publicationIDToDelete: publicationID
        })
    }

    erasePublication(publicationID){
        let currentComponent = this
        let data = {}
        PublicationService.erasePublication(publicationID,this.props).then(function (response){
            if(response.status !== StatusCode.NO_CONTENT){
                ErrorService.logError(currentComponent.props,response)
                return;
            }
            currentComponent.setState({
                myPublications: [],
                showModal: false
            })
            if(Math.ceil((currentComponent.state.resultsQuantity - 1) / Constants.PUBLICATIONS_PAGE_LIMIT) < currentComponent.state.pagesQuantity
                && currentComponent.state.page === currentComponent.state.pagesQuantity - 1)
                data.selected = currentComponent.state.page - 1;
            else
                data.selected = currentComponent.state.page;
            currentComponent.handlePageClick(data)
        })
    }


    initializePublications(t){
        let pubComponents = [];
        
        for(let i = 0; i < this.state.myPublications.length; i++){
            pubComponents.push(
                <Publication t={t} 
                    publication={this.state.myPublications[i]}  
                    page="MyPublications"
                    favourites={false}
                    editable={true}
                    eraseFunction={this.showModalErasePublication}
                    ready={this.setReady}
                    index={i}
                    />
            )
        }
        
        return pubComponents;
    }

    setReady(){
        if(LocalStorageService.getCounter() === this.state.myPublications.length){
            LocalStorageService.deleteCounter()
            this.setState({loadingPublications: false})
        }    
    }

    loadingContainers(){
        let pubComponents = [];
        for(let i = 0; i < Constants.PUBLICATIONS_PAGE_LIMIT; i++){
            pubComponents.push(
                <div className="loader-container"> 
                    <PublicationLoader/>
                </div>
            )
        }
        return pubComponents;
    }

    

    render(){
        const { t } = this.props;
        let publications = this.initializePublications(t);  
        let loadingPublications = this.loadingContainers()
        return(
            <div>
                <ProfileAsideBar t={t} active="MyPublications"/>
                <ToastNotification 
                    show={this.state.showModal}
                    title={t('modal.deletePublication')}
                    information={t('modal.deletePublicationDetail')}
                    checkModal={true}
                    acceptFunction={this.erasePublication}
                    functionParameter={this.state.publicationIDToDelete}
                />
                <div className="Publications">
                    <h2 className="title_section">{t('mypublications.title_section')}: {this.state.myPublicationsCounter}</h2> 
                </div>
                {this.state.loadingPublications === true ?
                                <div className="loader-all-container">
                                    {loadingPublications}
                                </div>
                        : null}
                <section className="section_publications">
                            <div className={this.state.loadingPublications === true ? "hidden":null}>
                                {publications}
                            </div>
                            {this.state.myPublications.length != 0 ?
                            (<div class="pubsPagination">
                                <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                pageCount={this.state.pagesQuantity}
                                forcePage={this.state.page}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={this.handlePageClick}
                                activeClassName={'active'}
                                breakClassName={''}
                                containerClassName={'container-pagination separation'}
                                pageClassName={''}
                                previousClassName={''}
                                nextClassName={''}
                            />
                            </div>) : null}
                    </section>
            </div>
        );
    }

}

export default withRouter(withTranslation()(MyPublications));
