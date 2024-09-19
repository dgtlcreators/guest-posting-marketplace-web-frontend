import { PuffLoader } from 'react-spinners';

const ReactSpinnerLoader = () => {
  return (
    <div className="spinner-container">
      <PuffLoader color="#36d7b7" loading={true} size={60} />
    </div>
  );
};

export default ReactSpinnerLoader;
