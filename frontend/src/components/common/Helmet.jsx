import React from 'react';

function Helmet(props) {
  document.title = props.title + ' - Cloud Storage';

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div>{props.children}</div>;
}

export default Helmet;
