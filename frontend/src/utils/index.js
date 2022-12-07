export const download = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
