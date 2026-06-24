export const optimizeCloudinaryUrl = (url, width = 400, height = null) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;
  
  let transformation = `w_${width},c_scale,q_auto,f_auto`;
  if (height) {
    transformation = `w_${width},h_${height},c_fill,q_auto,f_auto`;
  }
  
  return url.replace('/upload/', `/upload/${transformation}/`);
};