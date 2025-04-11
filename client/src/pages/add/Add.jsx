import React, { useReducer, useState } from "react";
import "./Add.scss";
import { categories } from "../../data";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  const categoriesList = categories();

  return (
    <div className="add-service">
      <h1 className="add__title">Add New Gig</h1>
      <div className="add__container">
        <h2 className="add__section-title">Add New Gig</h2>
        <div className="add__top-container">
          <div className="add__image-container">
              <p className="image-title">Cover Image</p>
              <label className="upload-box">
                {singleFile && <img src={URL.createObjectURL(singleFile)} alt="cover" />}
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                {!singleFile && <div className="empty empty-top">+</div>}
              </label>
          </div>
          <div className="add__add-fields-section">
              <div className="form-title-field">
              <label  className="form-title" htmlFor="">Title</label>
              <input
                className="form-field"
                type="text"
                name="title"
                placeholder="e.g. I will do something I'm really good at"
                onChange={handleChange}
              />
              </div>
              <div className="form-title-field">
                <label className="form-title" htmlFor="">Category</label>
                <select className="form-field select-field" name="cat" id="cat" onChange={handleChange}>
                  <option value="" disabled selected>Select category</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-title-field">
                <label className="form-title" htmlFor="">Description</label>
                <textarea
                  className="form-field-description"
                  name="desc"
                  id=""
                  placeholder="Brief descriptions to introduce your service to customers"
                  cols="30"
                  rows="10"
                  onChange={handleChange}
                ></textarea>
              </div>
          </div>
        </div>
        <h2 className="add__section-title">Add New Gig</h2>
        <div className="add__bottom-container">
          <div className="add__image-container">
            <div className="image-container">
                <p className="image-title">Images of your work</p>
                {files.map((file, idx) => (
                  <label className="upload-box" key={idx}>
                    <img src={URL.createObjectURL(file)} alt={`img-${idx}`} />
                    <input
                      type="file"
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[idx] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                    />
                  </label>
                ))}
            </div>
            <label className="upload-box empty">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
                  }}
                />
            </label>
            <button className="add__white-button" onClick={handleUpload}>
              {uploading ? "uploading" : "Upload"}
            </button>
          </div>
          <div className="add__add-fields-section">
            <div className="form-title-field">
              <label className="form-title" htmlFor="">Service Title</label>
              <input
                className="form-field"
                type="text"
                name="shortTitle"
                placeholder="e.g. One-page web design"
                onChange={handleChange}
              />
            </div>
            <div className="form-title-field">
              <label className="form-title" htmlFor="">Short Description</label>
              <textarea
                className="form-field-description"
                name="shortDesc"
                onChange={handleChange}
                id=""
                placeholder="Short description of your service"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="form-title-field">
              <label className="form-title" htmlFor="">Revision Number</label>
              <input
                className="form-field"
                type="number"
                name="revisionNumber"
                onChange={handleChange}
              />
            </div>
            <div className="form-title-field">
              <label className="form-title" htmlFor="">Add Features</label>
              <form action="" className="add" onSubmit={handleFeature}>
                <div className="form-feature-field-button">
                  <input
                    className="form-field form-field-feature"
                    type="text"
                    placeholder="e.g. page design"
                  />
                  <button className="form-feature-button" type="submit">add</button>
                </div>
              </form>
              <div className="addedFeatures">
                {state?.features?.map((f) => (
                  <div className="addedFeatures-item" key={f}>
                    <button
                      className="addedFeatures-button"
                      onClick={() =>
                        dispatch({ type: "REMOVE_FEATURE", payload: f })
                      }
                    >
                      {f}
                      <span>X</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-short-section">
              <div className="form-title-field">
                <label className="form-title"  htmlFor="">Price</label>
                <input
                  className="form-field form-field-short"
                  type="number"
                  onChange={handleChange}
                  name="price"
                />
              </div>
              <div className="form-title-field">
                <label className="form-title" htmlFor="">Delivery Time (e.g. 3 days)</label>
                <input
                  className="form-field form-field-short"
                  type="number"
                  name="deliveryTime"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="add__red-button" onClick={handleSubmit}>Create</button>
      </div>
    </div>
  )
}

export default Add;
