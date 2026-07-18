import { useState } from "react";

function getFirstPhoto(photoJson) {
  if (!photoJson) {
    return null;
  }
  try {
    const photos = JSON.parse(photoJson);
    if (Array.isArray(photos) && photos.length > 0 && photos[0]) {
        return photos[0];
    }
    return null;
  } catch (error) {
    return null;
  }
}

function formatPrice(price) {
  const number = Number(price);
  if (!number) {
    return "Price unavailable";
  }
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function PropertyCard({ property }) {
  const firstPhoto = getFirstPhoto(property.L_Photos);
  const [imageFailed, setImageFailed] = useState(false);

  const shouldShowImage = firstPhoto && !imageFailed;

  return (
    <article className="property-card">
      {shouldShowImage ? (
        <img
          className="property-photo"
          src={firstPhoto}
          alt={property.L_Address || "Property"}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="property-photo property-photo-placeholder">
          Image unavailable
        </div>
      )}

      <div className="property-card-body">
        <h2>{formatPrice(property.L_SystemPrice)}</h2>
        <p className="property-address">{property.L_Address}</p>
        <p className="property-location">
          {property.L_City}, {property.L_State}
        </p>
        <div className="property-stats">
          <span>{property.L_Keyword2 || "-"} beds</span>
          <span>{property.LM_Dec_3 || "-"} baths</span>
          <span>{property.LM_Int2_3 || "-"} sqft</span>
        </div>

      </div>
    </article>
  );
}

export default PropertyCard;