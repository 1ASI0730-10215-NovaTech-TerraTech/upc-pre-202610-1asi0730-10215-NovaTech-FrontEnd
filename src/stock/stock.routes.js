import StockView from './presentation/views/stock-view.vue';

const stockRoutes = [
    {
        path: '/inventory',
        name: 'inventory',
        component: StockView
    }
];

export default stockRoutes;