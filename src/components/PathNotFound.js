import { useTheme } from "../context/ThemeProvider.js";


const PathNotFound = () => {
  const { isDarkTheme } = useTheme();

  

    return (
      <div className="flex items-center justify-center flex-col">
        <h2 className='text-xl font-bold'>404 - Page Not Found</h2>
        <p className='my-3'>The page you are looking for does not exist.</p>
        <a href="/" className='px-2 py-1 rounded-lg bg-blue-500 text-decoration-none'>Go Home</a>
      </div>
    );
  }
  
  export default PathNotFound