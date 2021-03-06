package ar.edu.itba.paw.models.dto;

public class PublicationDTO {

	public final static String MediaType = "application/vnd.meinHaus.publication-v1.0+json";

	private String title;
	private String provinceid;
	private String cityid;
	private String neighborhoodid;
	private String address;
	private String operation;
	private String price;
	private String description;
	private String propertyType;
	private String bedrooms;
	private String bathrooms;
	private String dimention;
	private String parking;
	private String coveredFloorSize;
	private String balconies;
	private String amenities;
	private String storage;
	private String expenses;
	private long publicationid;
	private String date;
	private int images;
	private String userEmail;
	private String phoneNumber;
	private boolean isFavourite;

	public PublicationDTO(long publicationid, String title, String provinceid, String cityid, String neighborhoodid,
			String address, String operation, String price, String description, String propertyType, String bedrooms,
			String bathrooms, String dimention, String parking, String date, String coveredFloorSize, String balconies,
			String amenities, String storage, String expenses) {
		this.publicationid = publicationid;
		this.title = title;
		this.setProvinceid(provinceid);
		this.setCityid(cityid);
		this.setNeighborhoodid(neighborhoodid);
		this.address = address;
		this.operation = operation;
		this.price = price;
		this.description = description;
		this.propertyType = propertyType;
		this.bedrooms = bedrooms;
		this.bathrooms = bathrooms;
		this.dimention = dimention;
		this.parking = parking;
		this.coveredFloorSize = coveredFloorSize;
		this.balconies = balconies;
		this.amenities = amenities;
		this.storage = storage;
		this.expenses = expenses;
		this.setDate(date);
		this.setFavourite(false);
	}

	public PublicationDTO() {
	};

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPropertyType() {
		return propertyType;
	}

	public void setPropertyType(String propertyType) {
		this.propertyType = propertyType;
	}

	public String getBedrooms() {
		return bedrooms;
	}

	public void setBedrooms(String bedrooms) {
		this.bedrooms = bedrooms;
	}

	public String getBathrooms() {
		return bathrooms;
	}

	public void setBathrooms(String bathrooms) {
		this.bathrooms = bathrooms;
	}

	public String getDimention() {
		return dimention;
	}

	public void setDimention(String dimention) {
		this.dimention = dimention;
	}

	public String getParking() {
		return parking;
	}

	public void setParking(String parking) {
		this.parking = parking;
	}

	public long getPublicationid() {
		return publicationid;
	}

	public String getCoveredFloorSize() {
		return coveredFloorSize;
	}

	public void setCoveredFloorSize(String coveredFloorSize) {
		this.coveredFloorSize = coveredFloorSize;
	}

	public String getBalconies() {
		return balconies;
	}

	public void setBalconies(String balconies) {
		this.balconies = balconies;
	}

	public String getAmenities() {
		return amenities;
	}

	public void setAmenities(String amenities) {
		this.amenities = amenities;
	}

	public String getStorage() {
		return storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public String getExpenses() {
		return expenses;
	}

	public void setExpenses(String expenses) {
		this.expenses = expenses;
	}

	public void setPublicationid(long publicationid) {
		this.publicationid = publicationid;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public int getImages() {
		return images;
	}

	public void setImages(int images) {
		this.images = images;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getNeighborhoodid() {
		return neighborhoodid;
	}

	public void setNeighborhoodid(String neighborhoodid) {
		this.neighborhoodid = neighborhoodid;
	}

	public String getCityid() {
		return cityid;
	}

	public void setCityid(String cityid) {
		this.cityid = cityid;
	}

	public String getProvinceid() {
		return provinceid;
	}

	public void setProvinceid(String provinceid) {
		this.provinceid = provinceid;
	}

	public boolean isFavourite() {
		return isFavourite;
	}

	public void setFavourite(boolean isFavourite) {
		this.isFavourite = isFavourite;
	}

}
