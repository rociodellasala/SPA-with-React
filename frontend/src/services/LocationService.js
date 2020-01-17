import LocalStorageService from './LocalStorageService'
import ErrorService from './ErrorService'
import JsonService from './JsonService'
import * as statusCode from '../util/StatusCode'
import axios from 'axios';

const LocationService = (function(){

    const LOCATIONS_PATH = 'meinHaus/locations-management'

    async function _postProvince(dataDTO){
        return await axios({
            method: 'post',
            url: `${LOCATIONS_PATH}/provinces`,
            data: dataDTO,
            headers: {
                authorization: LocalStorageService.getAccessToken(),
            }
        }).then(function (response){ return response }).catch(function (error){ return error.response })
    }
    
    async function _postCity(dataDTO){
        return await axios({
          method: 'post',
          url: `${LOCATIONS_PATH}/cities`,
          data: dataDTO,
          headers: {
            authorization: LocalStorageService.getAccessToken(),
        }
        }).then(function (response){ return response }).catch(function (error){ return error.response })
    }

    async function _postNeighborhood(dataDTO){
        return await axios({
          method: 'post',
          url: `${LOCATIONS_PATH}/neighborhoods`,
          data: dataDTO,
          headers: {
            authorization: LocalStorageService.getAccessToken(),
        }
        }).then(function (response){ return response }).catch(function (error){ return error.response })
    }

    async function _getProvinces(){
        return await axios({
            method: 'get',
            url: `${LOCATIONS_PATH}/provinces`,
          }).then(function (response){ return response }).catch(function (error){ return error.response })
    }

    async function _getCities(provinceid){
        return await axios({
            method: 'get',
            url: `${LOCATIONS_PATH}/provinces/${provinceid}/cities`,
          }).then(function (response){ return response }).catch(function (error){ return error.response })
      }

    async function _getNeighborhoods(provinceid,cityid){
        return await axios({
            method: 'get',
            url: `${LOCATIONS_PATH}/provinces/${provinceid}/cities/${cityid}/neighborhoods`,
          }).then(function (response){ return response }).catch(function (error){ return error.response })
    }
    

   return {
      postProvince : _postProvince,
      postCity : _postCity,
      postNeighborhood : _postNeighborhood,
      getProvinces : _getProvinces,
      getCities : _getCities,
      getNeighborhoods : _getNeighborhoods
    }
   })();

   export default LocationService;