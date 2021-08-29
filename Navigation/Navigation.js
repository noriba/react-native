import {createStackNavigator} from 'react-navigation-stack'
import Search from '../Components/Search'
import {createAppContainer} from "react-navigation";
import FilmDetail from "../Components/FilmDetail";
import Favorites from "../Components/Favorites";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Text} from "react-native";
import React from "react";

const SearchStackNavigator = createStackNavigator({
    Search: { // Ici j'ai appelé la vue "Search" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
        screen: Search,
        navigationOptions: {
            title: 'Rechercher'
        }
    },
    FilmDetail: { // Encore une fois j'ai mis le même nom que celui du component mais libre à vous de choisir un nom différent
        screen: FilmDetail
    }
})

const FavStackNavigator = createStackNavigator({
    Favorites: { // Ici j'ai appelé la vue "Search" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
        screen: Favorites,
        navigationOptions: {
            title: 'Favoris'
        }
    },
    FilmDetail: { // Encore une fois j'ai mis le même nom que celui du component mais libre à vous de choisir un nom différent
        screen: FilmDetail
    }
})
const MoviesTabNavigator = createBottomTabNavigator(
    {
        Search: {
            screen: SearchStackNavigator,
            navigationOptions: {
                tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
                    return <Icon name="movie-search" color="blue" size={30} />;
                }
            }
        },
        Favorites: {
            screen: FavStackNavigator,
            navigationOptions: {
                tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
                    return <Icon name="heart" color="red" size={30} />;
                }
            }
        }
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
            inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
            showLabel: false, // On masque les titres
            showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
        }
    }
)


export default createAppContainer(MoviesTabNavigator)
