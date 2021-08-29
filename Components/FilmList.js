import React from "react";
import {ActivityIndicator, FlatList, StyleSheet, View} from "react-native";
import {connect} from "react-redux";
import FilmItem from "./FilmItem";
import Search from "./Search";

class FilmList extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0 // Compteur pour connaître la page courante
        this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.state = {
            films: [],
            isLoading: false // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche

        }
        this.searchedText = ""
    }

    _getFav(currentItem,favoritesFilm) {
        if(favoritesFilm){        return favoritesFilm.find(item => item.id === currentItem.id);
        }else{return true}
    }

    _toggleFav(currentItem) {
        const action = {type: "TOGGLE_FAVORITE", value: currentItem}
        this.props.dispatch(action)

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

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)
        this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
    }

    render() {
        console.log(this.props)
        const {films,favoritesFilm, toggleFav,displayDetailForFilmOfList,loadFilms,totalPages,page} = this.props

        return (
            <View style={{flex: 6, flexDirection: 'row'}}>

                <View style={styles.text1}>
                    <FlatList
                        data={films}
                        initialNumToRender={10}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) =>
                            <FilmItem toggle={() => toggleFav(item)}
                                      isFilmFavorite={this._getFav(item,favoritesFilm)}
                                      filmId={this.state.films.findIndex(i => i.id === item.id)}
                                      film={item}
                                      displayDetailForFilm={() => displayDetailForFilmOfList(item.id)}
                            />}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if (page < totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                                console.log("Calling API to loadfilms...")
                                this.props.loadFilms()
                            }
                        }}
                        extraData={this.props.favoritesFilm}
                    />

                    {this._displayLoading()}

                </View>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    fav: {}
})

export default FilmList
