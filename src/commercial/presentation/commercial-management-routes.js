import ProductList from "./views/product-list.vue";
import OrderList from "./views/order-list.vue";

export const commercialRoutes = [
    {
        path: '/commercial/catalog',
        name: 'commercial-catalog',
        component: ProductList
    },
    {
        path: '/commercial/order-summary',
        name: 'order-summary',
        component: OrderList
    }
];