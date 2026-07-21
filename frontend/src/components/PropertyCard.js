import { useEffect, useMemo, useState } from "react";

function getPhotos(photoJson) {
  if (!photoJson) {
    return [];
  }

  try {
    const photos = JSON.parse(photoJson);

    if (!Array.isArray(photos)) {
      return [];
    }

    return photos.filter((photo) => {
      if (typeof photo !== "string") {
        return false;
      }

      const value = photo.trim();
      return value !== "" && value.toLowerCase() !== "ws";
    });
  } catch (error) {
    return [];
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
  const photos = useMemo(() => getPhotos(property.L_Photos), [property.L_Photos]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const currentPhoto = photos[photoIndex];

  useEffect(() => {
    setPhotoIndex(0);
    setImageFailed(false);
  }, [property.L_Photos]);

  function handleImageError() {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else {
      setImageFailed(true);
    }
  }

  const shouldShowImage = currentPhoto && !imageFailed;

  return (
    <article className="property-card">
      {shouldShowImage ? (
        <img
          className="property-photo"
          src={currentPhoto}
          alt={property.L_Address || "Property"}
          onError={handleImageError}
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
