import React from 'react';

let[productName, setProductName] = useState('');
let[productDescription, setProductDescription] = useState('');
let[productPrice, setProductPrice] = useState('');
let[productImage, setProductImage] = useState([]);

const ProductForm = () => {

    const handleProductName = (e) => {
        let productName = e.target.value;
        setProductName(Name)

    }

    const handleProductDescription = (e) => {
        let productName=e.target.value;
        setProductDescription(description)
    }
    const handleProductPrice = (e) => {
        let price = e.target.value;
        setProductPrice(price)
    }

    return(
        <form action="">
        <label htmlFor=''>Prodcut name</label>
        <input type='text' placeholder='Enter product number' />
        <label htmlFor=''>Prodcut description</label>
        <input type='text' placeholder='Enter product description' />
        <label htmlFor=''>Prodcut price</label>
        <input type='text' placeholder='Enter product price' />
        <label htmlFor=''>Prodcut image</label>
        <input type='file' placeholder='enter your image' />

        </form>

    )
}

export default ProductForm;