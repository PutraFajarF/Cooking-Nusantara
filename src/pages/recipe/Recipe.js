import { useFetch } from '../../hooks/useFetch';
import { useParams } from 'react-router-dom';

// styles
import './Recipe.css';

const Recipe = () => {
  const { id } = useParams();
  const url = 'http://localhost:3000/recipes/' + id;
  const { data: recipe, isLoading, error } = useFetch(url);
  return(
    <div className='recipe'>
      {error && <p className='error'>{error}</p>}
      {isLoading && <p className='loading'>Loading..</p>}
      {recipe && <h1>{recipe.title}</h1>}
    </div>
  )
};

export default Recipe;