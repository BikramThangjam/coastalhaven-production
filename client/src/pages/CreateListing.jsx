import React, { useState } from "react";
import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const CreateListing = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  // LOCATION
  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    state: "",
    country: "",
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  // Basics count
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  // Amenities
  const [amenities, setAmenities] = useState([]);

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((item) => item !== facility)
      );
    } else {
      setAmenities((prevAmenities) => [...prevAmenities, facility]);
    }
  };



  // Description
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: 0,
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  //upload, drag and drop, remove photos
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  // Submit
  const creatorId = useSelector(state => state.user._id);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // creating FormData to handle file uploads
      const listingForm = new FormData()

      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("aptSuite", formLocation.aptSuite);
      listingForm.append("city", formLocation.city);
      listingForm.append("state", formLocation.state);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount",guestCount );
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("bedCount", bedCount);
      listingForm.append("bathroomCount", bathroomCount);
      listingForm.append("amenities", amenities);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description );
      listingForm.append("highlight", formDescription.highlight );
      listingForm.append("highlightDesc", formDescription.highlightDesc);
      listingForm.append("price", formDescription.price);

      // Append each selected photos to formdata object
      photos.forEach(photo => {
        listingForm.append("listingPhotos", photo);
      })

      // send a post request
      const response = await fetch(`${API_URL}/properties/create`,{
        method: "POST",
        body: listingForm
      })
      
      if(response.ok){
        navigate("/")
      }

    } catch (err) {
      console.log("Failed to publish listing, ", err.message)
    }
  }

  return (
    <>
      <Navbar />
      <div className="create-listing">
        <h1>Publish your Place</h1>
        <form onSubmit={handleSubmit}> 
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your place</h2>
            <hr />
            <h3>Which of ṭhese categories best describes your place?</h3>
            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    category === item.label ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">
                    <item.icon />
                  </div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            <h3>What type of place will guest have?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">
                    <item.icon />
                  </div>
                </div>
              ))}
            </div>
            <h3>Where's your place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Street address..."
                  required
                  onChange={handleChangeLocation}
                  value={formLocation.streetAddress}
                />
              </div>
            </div>
            <div className="half">
              <div className="location">
                <p>Apartment, suite, etc., (if applicable)</p>
                <input
                  type="text"
                  name="aptSuite"
                  placeholder="Apt, Suite, etc., (if applicable)"
                  onChange={handleChangeLocation}
                  value={formLocation.aptSuite}
                />
              </div>
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  name="city"
                  placeholder="city"
                  required
                  onChange={handleChangeLocation}
                  value={formLocation.city}
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>State</p>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  onChange={handleChangeLocation}
                  value={formLocation.state}
                />
              </div>
              <div className="location">
                <p>Country</p>
                <input
                  type="text"
                  name="country"
                  placeholder="country"
                  required
                  onChange={handleChangeLocation}
                  value={formLocation.country}
                />
              </div>
            </div>
            <h3>Share some basics about your place</h3>
            <div className="basics">
              {[
                {
                  name: "Guests",
                  count: guestCount,
                  increase: () => setGuestCount(guestCount + 1),
                  decrease: () =>
                    guestCount > 1 && setGuestCount(guestCount - 1),
                },
                {
                  name: "Bedrooms",
                  count: bedroomCount,
                  increase: () => setBedroomCount(bedroomCount + 1),
                  decrease: () =>
                    bedroomCount > 1 && setBedroomCount(bedroomCount - 1),
                },
                {
                  name: "Bathrooms",
                  count: bathroomCount,
                  increase: () => setBathroomCount(bathroomCount + 1),
                  decrease: () =>
                    bathroomCount > 1 && setBathroomCount(bathroomCount - 1),
                },
                {
                  name: "Beds",
                  count: bedCount,
                  increase: () => setBedCount(bedCount + 1),
                  decrease: () => bedCount > 1 && setBedCount(bedCount - 1),
                },
              ].map((basic, index) => (
                <div className="basic" key={index}>
                  <p>{basic.name}</p>
                  <div className="basic_count">
                    <RemoveCircleOutline
                      onClick={basic.decrease}
                      sx={{
                        fontSize: "25px",
                        cursor: "pointer",
                        "&:hover": { color: "#F8395A" },
                      }}
                    />
                    <p>{basic.count}</p>
                    <AddCircleOutline
                      onClick={basic.increase}
                      sx={{
                        fontSize: "25px",
                        cursor: "pointer",
                        "&:hover": { color: "#F8395A" },
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <hr />
            <h3>Tell guests what your place has to offer</h3>
            <div className="amenities">
              {facilities.map((item, index) => (
                <div
                  className={`facility ${
                    amenities.includes(item.name) ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className="facility_icon">
                    <item.icon />
                  </div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
            <h3>Add some photos of your place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="photo"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt="place"
                                    style={{ objectFit: "cover" }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}

                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h3>What makes your place attractive and exciting?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                required
                onChange={handleChangeDescription}
              />
              <p>Description</p>
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={formDescription.description}
                required
                onChange={handleChangeDescription}
              />
              <p>Highlight</p>
              <input
                type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                required
                onChange={handleChangeDescription}
              />
              <p>Highlight details</p>
              <textarea
                type="text"
                placeholder="Highlight details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                required
                onChange={handleChangeDescription}
              />
              <p>Now, set your PRICE</p>
              <span>&#8377;</span>
              <input
                type="number"
                placeholder="100"
                name="price"
                value={formDescription.price}
                className="price"
                required
                onChange={handleChangeDescription}
              />
            </div>
          </div>
          <button className="submit_btn" type="submit">CREATE YOUR LISTING</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateListing;
