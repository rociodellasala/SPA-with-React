package ar.edu.itba.paw.interfaces;

import java.util.List;

import ar.edu.itba.paw.models.City;
import ar.edu.itba.paw.models.Neighborhood;
import ar.edu.itba.paw.models.Province;

public interface LocationDao {
	
	public Province createProvince(String province);
	
	public City createCity(String city, long provinceid);
	
	public Neighborhood createNeighborhood(String neighborhood, long cityid);
	
	public List<Province> getProvinces();
	
	public List<City> getCities(long provinceID);
	
	public List<Neighborhood> getNeighborhoods(long cityID);

}
