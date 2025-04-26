// When user clicks Add to Cart button
function addToCart(productId) {
  fetch('http://localhost:3000/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId: productId, quantity: 1 })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    })
    .then(data => {
      alert('Product added to cart successfully!');
      console.log(data);
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart.');
    });
}

// When user clicks Checkout button
function checkout() {
  fetch('http://localhost:3000/checkout', {
    method: 'POST'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Checkout failed');
      }
      return response.json();
    })
    .then(data => {
      alert('Checkout successful! Order ID: ' + data.order.id);
      console.log(data);
    })
    .catch(error => {
      console.error('Error during checkout:', error);
      alert('Checkout failed.');
    });
}