import React from "react";
import { IoIosTrash, IoIosAddCircle } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Categories = props => {
  const {user} = React.useContext(UserContext);

  if (user && !user.token) {
		// let categoryList = props.categories.reduce((list, category) => list + ', ' + category.category, '').substring(2);
		let categoryList = (props.categories.length ? props.categories.map(category => category.category).join(', ') : null);
    return (
			<div className={styles.row}>
				<div className={styles.label}>Categories</div>
				<div className={styles.label}>
					{typeof categoryList === 'string' ? categoryList : null}
				</div>
			</div>
    )
  }

  return (
		<div className={styles.row}>
			<div>
				<h3>Categories</h3>
				
			</div>
			{props.categories.map(category => (
				<Category
					key={category.category_id}
					category={category}
					meaning={props.meaning}
					meaningsCategories={props.meaningsCategories}
					updateCategory={props.updateCategory}
					deleteCategory={props.deleteCategory}
				/>
			))}
			<button className={styles.button} onClick={e => props.addNewCategory(props.meaning.id)}><IoIosAddCircle /></button>
		</div>
  );
};

export default Categories;


const Category = props => {
	const category = props.category;
  const [style, setStyle] = React.useState({display: 'block'});

	return (
		<div 
			onMouseEnter={e => {
				setStyle({display: 'block'});
			}}
			onMouseLeave={e => {
				setStyle({display: 'block'});
			}}
			key={category.category_id}
		>
			{/* <label className={styles.label} htmlFor={"meaning_category_" + category.category_id}>{i+1}</label> */}
			<input 
				type="text"
				name={"category_" + category.category_id}
				id={"category_" + category.category_id}
				className={styles.inputCategory}
				placeholder="new category"
				value={category.category}
				list="meaning_categories"
				onChange={e => props.updateCategory(e.target.value, props.meaning.id, category.category_id)}
			/>
			<datalist id="meaning_categories">
				{props.meaningsCategories.map((category, key) => (
					<option
						key={key}
						value={category}
					/>
				))}
			</datalist>
			<button className={styles.delete} style={style} onClick={e => props.deleteCategory(props.meaning.id, category.category_id)}><IoIosTrash /></button>
		</div>
	)
};