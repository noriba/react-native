// Components/Favorites.js

import React, {useEffect} from 'react'
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native'
import {connect} from "react-redux";
import FilmItem from "./FilmItem";
import {getFilmDetailFromApi} from "../API/TMDBApi";
import FilmList from "./FilmList";
import * as navigation from "react-native";

class Favorites extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0 // Compteur pour connaître la page courante
        this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.state = {
            films: this.props.favoritesFilm,
            isLoading: false // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche

        }
    }


    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                    {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
                </View>
            )
        }
    }

    _getFav(currentItem) {
        return this.props.favoritesFilm.find(item => item.id === currentItem.id);
    }

    _toggleFav(currentItem) {
        const action = {type: "TOGGLE_FAVORITE", value: currentItem}
        this.props.dispatch(action)

    }

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)
        this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
    }





    render() {
        console.log(this.props)

        return (
            <View style={{flex: 6, flexDirection: 'row'}}>

                <FilmList films={this.props.favoritesFilm}
                          favoritesFilm={this.props.favoritesFilm}
                          toggleFav={(item) => this._toggleFav(item)}
                          displayDetailForFilmOfList={this._displayDetailForFilm}
                          navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                          loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                          page={this.page}
                          totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                />
                {this._displayLoading()}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container2: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textinput: {
        marginLeft: 5,
        marginBottom: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    view1: {
        marginTop: 20,
    },
    text1: {
        flex: 4,
        backgroundColor: 'white'
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(Favorites)
