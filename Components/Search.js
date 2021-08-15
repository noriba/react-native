import React from 'react'
import {StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator} from 'react-native'
import films from '../Helpers/filmsData'
import FilmItem from "./FilmItem";
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi'; // import { } from ... car c'est un export nommé dans TMDBApi.js

class Search extends React.Component {

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

    _searchTextInputChanged(text) {
        this.searchedText = text
    }

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)
        this.props.navigation.navigate("FilmDetail", { idFilm: idFilm })
    }

    _loadFilms() {
        if (this.searchedText.length > 0) {
            this.setState({isLoading: true})
            console.log("page : ", this.page)
            console.log("avant : ",this.state.films)
            getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(data => {


                console.log("data from API : ",data)
                this.page = data.page
                this.totalPages = data.total_pages

                this.setState({
                    films: [...this.state.films, ...data.results],
                    isLoading: false
                })
                console.log("page : ", this.page)
                console.log("apres :",this.state.films)

            })
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
                <View style={{flex: 6, flexDirection: 'row', backgroundColor: 'red'}}>

                    <View style={styles.text1}>
                        <FlatList
                            data={this.state.films}
                            initialNumToRender={10}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => <FilmItem filmId={this.state.films.findIndex(i => i.id === item.id)} film={item} displayDetailForFilm={this._displayDetailForFilm} />}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (this.page < this.totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                                    console.log("Calling API to loadfilms...")
                                    this._loadFilms()
                                }
                            }}
                        />

                        {this._displayLoading()}

                    </View>

                </View>
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


export default Search
