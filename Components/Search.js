import React from 'react'
import {StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator} from 'react-native'
import films from '../Helpers/filmsData'
import FilmItem from "./FilmItem";
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi';
import {connect} from "react-redux";
import FilmList from "./FilmList"; // import { } from ... car c'est un export nommé dans TMDBApi.js

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0 // Compteur pour connaître la page courante
        this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.state = {
            films: [],
            isLoading: false, // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche
            searchedText: ""

        }
        //this._loadFilms = this._loadFilms.bind(this)

    }

    _searchTextInputChanged(text) {
        this.setState({searchedText: text})
    }

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)

        this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
    }

    _loadFilms= ()=> {
        //console.log("props: ",this._loadFilms)
        //console.log("state: ", this.state)

        if (this.state.searchedText.length > 0) {
            this.setState({isLoading: true})
            console.log("page : ", this.page)
            console.log("avant : ", this.state.films)
            getFilmsFromApiWithSearchedText(this.state.searchedText, this.page + 1).then(data => {


                console.log("data from API : ", data)
                this.page = data.page
                this.totalPages = data.total_pages

                this.setState({
                    films: [...this.state.films, ...data.results],
                    isLoading: false
                })
                console.log("page : ", this.page)
                console.log("apres :", this.state.films)

            })
        }
    }

    _getFav(currentItem) {
        return this.props.favoritesFilm.find(item => item.id === currentItem.id);
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

    _searchFilms() {
        this.page = 0
        this.totalPages = 0
        this.setState({
            films: []
        }, () => {
            console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
            this._loadFilms()
        })
    }

    render() {
        console.log("RENDER")

        return (

            <View style={styles.main_container2}>
                <View style={styles.view1}>
                    <TextInput style={styles.textinput}
                               placeholder='Titre du film'
                               onChangeText={(text) => this._searchTextInputChanged(text)}
                               onSubmitEditing={() => this._searchFilms()}
                    />
                    <Button title='Rechercher' onPress={() => this._searchFilms()}/>
                    {/* Ici j'ai simplement repris l'exemple sur la documentation de la FlatList */}

                </View>
                {/*
                <View style={{flex: 6, flexDirection: 'row', backgroundColor: 'red'}}>

                    <View style={styles.text1}>
                        <FlatList
                            data={this.state.films}
                            initialNumToRender={10}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) =>
                                <FilmItem toggle={() => this._toggleFav(item)}
                                          isFilmFavorite={this._getFav(item)}
                                          filmId={this.state.films.findIndex(i => i.id === item.id)}
                                          film={item} displayDetailForFilm={this._displayDetailForFilm}
                                />}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (this.page < this.totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                                    console.log("Calling API to loadfilms...")
                                    this._loadFilms()
                                }
                            }}
                            extraData={this.props.favoritesFilm}
                        />

                        {this._displayLoading()}

                    </View>

                </View>
*/}
                <FilmList
                    films={this.state.films}
                    favoritesFilm={this.props.favoritesFilm}
                    toggleFav={(item) => this._toggleFav(item)}
                    displayDetailForFilmOfList={this._displayDetailForFilm}
                    navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                    loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                    page={this.page}
                    totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                    extraData={this.props.favoritesFilm}
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
        favoritesFilm: state.favoritesFilm,
        searchedText: state.searchedText
    }
}


export default connect(mapStateToProps)(Search)
