import React, { useReducer, useState } from "react";
import "./Add.scss";
import { categories } from "../../data";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/alert-message/AlertMessage";
import { useTranslation } from 'react-i18next';

const Add = () => {
  const { t } = useTranslation("add");
  const [showAlert, setShowAlert] = useState(false);
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);

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
    setShowAlert(true);
  };

  const categoriesList = categories();

  return (
    <div className="add-service">
      <h1 className="add__title">{t('add.addNewServiceTitle')}</h1>
      <div className="add__container">
        <div className="add__top-container">
          <div className="add__image-container">
          <div className="top-image-container">
            <p className="image-title">{t('add.images')}</p>
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
          </div>
          <div className="add__add-fields-section">
              <div className="form-title-field">
              <label  className="form-title" htmlFor="">{t('add.mainTitle')} <span className="required-star">*</span></label>
              <input
                className="form-field"
                type="text"
                name="title"
                placeholder={t('add.mainTitlePlaceholder')}
                onChange={handleChange}
              />
              </div>
              <div className="form-title-field">
                <label className="form-title" htmlFor="">{t('add.category')} <span className="required-star">*</span></label>
                <select className="form-field select-field" name="cat" id="cat" onChange={handleChange}>
                  <option value="" disabled selected>{t('add.selectCategory')}</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-title-field">
                <label className="form-title" htmlFor="">{t('add.serviceDescription')} <span className="required-star">*</span></label>
                <textarea
                  className="form-field-description"
                  name="desc"
                  id=""
                  placeholder={t('add.serviceDescriptionPlaceholder')}
                  cols="30"
                  rows="10"
                  onChange={handleChange}
                ></textarea>
              </div>
          </div>
        </div>
        <h2 className="add__section-title">{t('add.secondSectionTitle')}</h2>
        <h3 className="add__section-subtitle">{t('add.secondSectionSubtitle')}</h3>
        <div className="add__bottom-container">
          <div className="add__image-container">
          <p className="image-title">{t('add.coverImage')} <span className="required-star">*</span></p>
              <label className="upload-box">
                {singleFile && <img src={URL.createObjectURL(singleFile)} alt="cover" />}
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                {!singleFile && <div className="empty empty-top">+</div>}
              </label>
            <button className="add__white-button" onClick={handleUpload}>
              {uploading ? t('add.uploading') : t('add.uploadBtn')}
            </button>
          </div>
          <div className="add__add-fields-section">
            <div className="form-title-field">
              <label className="form-title" htmlFor="">{t('add.generalTitle')} <span className="required-star">*</span></label>
              <input
                className="form-field"
                type="text"
                name="shortTitle"
                placeholder={t('add.generalTitlePlaceholder')}
                onChange={handleChange}
              />
            </div>
            <div className="form-title-field">
              <label className="form-title" htmlFor="">{t('add.generalDesc')} <span className="required-star">*</span></label>
              <textarea
                className="form-field-description"
                name="shortDesc"
                onChange={handleChange}
                id=""
                placeholder={t('add.generalDescPlaceholder')}
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="form-title-field">
              <label className="form-title" htmlFor="">{t('add.features')}</label>
              <form action="" className="add" onSubmit={handleFeature}>
                <div className="form-feature-field-button">
                  <input
                    className="form-field form-field-feature"
                    type="text"
                    placeholder={t('add.featuresPlaceholder')}
                  />
                  <button className="form-feature-button" type="submit">{t('add.addBtn')}</button>
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
                <label className="form-title" htmlFor="">{t('add.location')} <span className="required-star">*</span></label>
                <input
                  className="form-field"
                  type="text"
                  name="location"
                  placeholder={t('add.locationPlaceholder')}
                  onChange={handleChange}
                />
              </div>
              <div className="form-title-field">
                <label className="form-title" htmlFor="">{t('add.deliveryTime')} <span className="required-star">*</span></label>
                <input
                  className="form-field form-field-short"
                  type="number"
                  name="deliveryTime"
                  onChange={handleChange}
                  placeholder={t('add.deliveryTimePlaceholder')}
                />
              </div>
            </div>
            <div className="form-title-field">
                <label className="form-title"  htmlFor="">{t('add.price')} <span className="required-star">*</span></label>
                <input
                  className="form-field"
                  type="number"
                  name="price"
                  placeholder={t('add.pricePlaceholder')}
                  onChange={handleChange}
                  disabled={isNegotiable}
                />
                <label style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => {
                      setIsNegotiable(e.target.checked);
                      dispatch({
                        type: "CHANGE_INPUT",
                        payload: { name: "isPriceNegotiable", value: e.target.checked },
                      });
                      if (e.target.checked) {
                        dispatch({
                          type: "CHANGE_INPUT",
                          payload: { name: "price", value: null },
                        });
                      }
                    }}
                  />
                  <span style={{ marginLeft: "8px" }}>{t('add.priceNegotiable')}</span>
                </label>
              </div>
          </div>
        </div>
        <button className="add__red-button" onClick={handleSubmit}>{t('add.createBtn')}</button>
      </div>
      {showAlert && (
        <AlertMessage
          message={t('add.alertMessage')}
          duration={4000}
           onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  )
}

export default Add;
