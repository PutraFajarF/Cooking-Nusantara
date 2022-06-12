import { useRef, useState, useEffect } from 'react';
import { projectFirestore } from '../../firebase/config';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// icon loader
import loader from '../../assets/loading.svg';

// styles
import './Create.css';
import { useTheme } from '../../hooks/useTheme';

const Create = () => {
  const [title, setTitle] = useState('');
  const [method, setMethod] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientAddError, setIngredientAddError] = useState(false);
  const [noIngredientError, setNoIngredientError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ingredientInput = useRef();
  const form = useRef();

  const { mode, color } = useTheme();

  //Query Parameters
  const navigate = useNavigate();
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const action = queryParams.get('action');

  //Route parameter
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    setNoIngredientError(ingredients.length === 0);
  }, [ingredients]);

  useEffect(() => {
    if(!action){
      setNoIngredientError(false);
      const docRef = projectFirestore.collection('recipes').doc(id);
      docRef.get().then(document => {
        const data = document.data();
        setTitle(data.title);
        setMethod(data.method);
        setCookingTime(Number(data.cookingTime.split(" ")[0]));
        setIngredients(data.ingredients)
      }) 
    } else {
      setTitle("");
      setMethod("");
      setCookingTime("");
      setIngredients([])
    }
  }, [action, id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const RecipeToAddOrUpdate = {
      title,
      ingredients,
      method,
      cookingTime: cookingTime + ' minutes'
    };
    
    if (!noIngredientError) {
      if(action === 'create') {
        try {
          await projectFirestore.collection('recipes').add(RecipeToAddOrUpdate);
          setIsSubmitted(false);
          navigate({
            pathname: '/',
            state: {addedRecipe: RecipeToAddOrUpdate}
         });
        } catch(error) {
          console.log(error);
        }
      } else {
        try {
          await projectFirestore.collection('recipes').doc(id).update(RecipeToAddOrUpdate);
          setIsSubmitted(false);
          navigate({
            pathname: '/',
            state: {updateRecipe: RecipeToAddOrUpdate}
         });
        } catch (err) {
          console.log(err);
        }
      };
    };
  };

  const handleAdd = (e) => {
    e.preventDefault()
    setIsSubmitted(false);
    if(newIngredient && ingredients.includes(newIngredient)) {
      setIngredientAddError(true);
      setTimeout(() => {
        setIngredientAddError(false);
      }, 2000); 
    }
    if(newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients(prev => {
        return [...prev, newIngredient.trim()]
      })
    }
    setNewIngredient('');
    ingredientInput.current.focus();
  };

  const removeIngredient = (index) => {
    setIngredients(prevIng => {
       return prevIng.filter(ing => ing !== prevIng[index])
   }); 
  };

  return (
    <div className={`create ${mode}`}>
      <h2 className="page-title">{action === 'create' ? 'Add a new Recipe!' : 'Update your Recipe!'}</h2>
      <form onSubmit={handleSubmit} ref={form}>

        <label>
          <span>{action === 'create' ? 'Recipe Title:' : 'New Title:'}</span>
          <input 
            type="text" 
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
            disabled={action !== 'create' && !title}
          />
        </label>

        <label>
          <span>{action === 'create' ? 'Recipe Ingredients:' : 'New Ingredients:'}</span>
          <div className="ingredients">
            <input 
              type="text" 
              onChange={(e) => {
                setNewIngredient(e.target.value);
                setIngredientAddError(false);
              }}
              value={newIngredient}
              ref={ingredientInput}
            />
            <button onClick={handleAdd} className="btn" style={{backgroundColor: color}}>Add</button>
          </div>
          {ingredientAddError && <p className='ingredient-error'>Ingredient already added!</p>}
          {noIngredientError && <p className='ingredient-error'>There should be at least one ingredient</p>}
        </label>
        <p>Current ingredients: {ingredients.map((ing, i) => {
          return <><em 
            style={{
              borderBottom: '1px solid' + color,
              cursor: 'pointer'
            }} key={ing} onClick={() => removeIngredient(i)}>{ing} </em><span> , </span></>})}
        </p>
        <p style={{fontSize: '0.8rem'}}>Click on an ingredient to delete it</p>

        <label>
          <span>{action === 'create' ? 'Recipe Method:' : 'New Method:'}</span>
          <textarea 
            onChange={(e) => setMethod(e.target.value)}
            value={method}
            required
            disabled={action !== 'create' && !method}
          />
        </label>

        <label>
          <span>{action === 'create' ? 'Cooking Time (minutes): ' : 'New Cooking Time(minutes):'}</span>
          <input 
            type="number" 
            onChange={(e) => setCookingTime(e.target.value)}
            value={cookingTime}
            required
            disabled={action !== 'create' && !cookingTime}
          />
        </label>
        {isSubmitted && !noIngredientError && <div className='loader-image'>
          <img 
          src={loader} 
          alt='Loading'
          style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
          />
        </div>}
        {(!isSubmitted || noIngredientError) && <button className='button' style={{backgroundColor: color}}>
          {action === 'create' ? 'Submit Recipe' : 'Update Recipe'}
        </button>} 
      </form>
    </div>
  )
}

export default Create;