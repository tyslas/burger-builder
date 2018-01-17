import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get( 'https://burger-togo.firebaseio.com/ingredients.json' )
            .then( response => {
                this.setState( { ingredients: response.data } );
            } )
            .catch( error => {
                this.setState( { error: true } );
            } );
    }

    updatePurchaseState ( ingredients ) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }

    addIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState( updatedIngredients );
    }

    removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState( updatedIngredients );
    }

    purchaseHandler = () => {
        this.setState( { purchasing: true } );
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        this.setState( { loading: true } );
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Max Schwarzmüller',
                address: {
                    street: 'Teststreet 1',
                    zipCode: '41351',
                    country: 'Germany'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post( '/orders.json', order )
            .then( response => {
                this.setState( { loading: false, purchasing: false } );
            } )
            .catch( error => {
                this.setState( { loading: false, purchasing: false } );
            } );
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if ( this.state.ingredients ) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
        if ( this.state.loading ) {
            orderSummary = <Spinner />;
        }
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler( BurgerBuilder, axios );


// import React, {Component} from 'react';
// import axios from '../../axios-orders';
//
// import Aux from '../../hoc/Aux/Aux';
// import Burger from '../../components/Burger/Burger';
// import BuildControls from '../../components/Burger/BuildControls/BuildControls';
// import Modal from '../../components/UI/Modal/Modal';
// import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
// import Spinner from '../../components/UI/Spinner/Spinner';
// import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
//
// const INGREDIENT_PRICES = {
//   salad: 1,
//   cheese: 1.25,
//   meat: 8,
//   bacon: 2
// }
//
// class BurgerBuilder extends Component {
//   state = {
//     ingredients: null,
//     totalPrice: 4,
//     purchaseable: false,
//     purchasing: false,
//     loading: false
//   }
//
//   componentDidMount() {
//     axios.get('https://burger-togo.firebaseio.com/ingredients.json')
//       .then(response => {
//         this.setState( {ingredient: response.data} );
//       })
//       .catch(error => {
//         this.setState( {error: true} )
//       })
//   }
//
//   updatePurchaseState (ingredients) {
//     const sum = Object.keys(ingredients)
//       .map(igKey => {
//         return ingredients[igKey];
//       })
//       .reduce((sum, el) => {
//         return sum + el
//       }, 0)
//       this.setState({purchaseable: sum > 0});
//   }
//
//   addIngredientHandler = (type) => {
//     const oldCount = this.state.ingredients[type];
//     const updatedCount = oldCount + 1;
//     const updatedIngredients = {
//       ...this.state.ingredients
//     };
//     updatedIngredients[type] = updatedCount;
//     const priceAddition = INGREDIENT_PRICES[type];
//     const oldPrice = this.state.totalPrice;
//     const newPrice = oldPrice + priceAddition;
//     this.setState({
//       totalPrice: newPrice,
//       ingredients: updatedIngredients
//     });
//     this.updatePurchaseState(updatedIngredients);
//   }
//
//   removeIngredientHandler = (type) => {
//     const oldCount = this.state.ingredients[type];
//     if (oldCount <= 0) {
//       return;
//     }
//     const updatedCount = oldCount - 1;
//     const updatedIngredients = {
//       ...this.state.ingredients
//     };
//     updatedIngredients[type] = updatedCount;
//     const priceDeduction = INGREDIENT_PRICES[type];
//     const oldPrice = this.state.totalPrice;
//     const newPrice = oldPrice - priceDeduction;
//     this.setState({
//       totalPrice: newPrice,
//       ingredients: updatedIngredients
//     })
//     this.updatePurchaseState(updatedIngredients);
//   }
//
//   purchaseHandler = () => {
//     this.setState({purchasing: true});
//   }
//
//   purchaseCancelHandler = () => {
//     this.setState({purchasing: false});
//   }
//
//   purchaseContinueHandler = () => {
//     // alert('You continue!');
//     this.setState( {loading: true} );
//     /* in a production app you would calculate the totalPrice from the server side to ensure that the user couldn't manipulate the price */
//     const order = {
//       ingredients: this.state.ingredients,
//       price: this.state.totalPrice,
//       customer: {
//         name: 'Tito Y',
//         address: {
//           street: '615 Kalmia Way',
//           zipcode: '80702',
//           country: 'USA'
//         },
//         email: 'iamtito@i.com'
//       },
//       deliveryMethod: 'fastest'
//     }
//     /* for firebase the post request goes any "node" (/orders) + .json
//     - appended to baseURL
//     - comment out 108-114 to see the loading animation after pressing continue */
//     axios.post('/orders.json', order)
//       .then(response => {
//         this.setState( {loading: false, purchasing: false});
//       })
//       .catch(error => {
//         this.setState( {loading: false, purchasing: false});
//       });
//   }
//
//   render () {
//     const disabledInfo = {
//       ...this.state.ingredients
//     }
//     for (let key in disabledInfo) {
//       disabledInfo[key] = disabledInfo[key] <= 0;
//     }
//
//     let orderSummary = null;
//     // setting the Spinner to load by default until the ingredients are uploaded from firebase DB
//     let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
//     if (this.state.ingredients) {
//       burger = (
//         <Aux>
//           <Burger ingredients={this.state.ingredients} />
//           <BuildControls
//             ingredientAdded={this.addIngredientHandler}
//             ingredientRemoved={this.removeIngredientHandler}
//             disabled={disabledInfo}
//             price={this.state.totalPrice}
//             purchaseable={!this.state.purchaseable}
//             ordered={this.purchaseHandler} />
//         </Aux>
//       );
//       orderSummary =
//         <OrderSummary
//           ingredients={this.state.ingredients}
//           price={this.state.totalPrice}
//           purchaseCancelled={this.purchaseCancelHandler}
//           purchaseContinued={this.purchaseContinueHandler} />;
//     }
//     if (this.state.loading) {
//       orderSummary = <Spinner />;
//     }
//     let burger = <Spinner />;
//
//     if (this.state.ingredients) {
//       burger = (
//         <Aux>
//           <Burger ingredients={this.state.ingredients} />
//           <BuildControls
//             ingredientAdded={this.addIngredientHandler}
//             ingredientRemoved={this.removeIngredientHandler}
//             disabled={disabledInfo}
//             price={this.state.totalPrice}
//             purchaseable={this.state.purchaseable}
//             ordered={this.purchaseHandler} />
//         </Aux>
//       );
//     }
//
//     // {salad: true, bacon: true, cheese: false, meat: false}
//     return (
//       <Aux>
//         <Modal
//           show={this.state.purchasing}
//           modalClosed={this.purchaseCancelHandler} >
//           {orderSummary}
//         </Modal>
//         {burger}
//       </Aux>
//     )
//   }
// }
//
// export default withErrorHandler(BurgerBuilder, axios);
