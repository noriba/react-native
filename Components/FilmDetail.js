// Components/FilmDetail.js

import React from 'react'
import {StyleSheet, View, ActivityIndicator, ScrollView, Text, Image, TouchableOpacity, Button} from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from "../API/TMDBApi";
import moment from "moment";
import numeral from "numeral";
import {connect} from "react-redux";
import {SmileTwoTone, HeartTwoTone, CheckCircleTwoTone} from '@ant-design/icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
            isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
        }
    }

    componentDidMount() {
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            })
        })
    }

    componentDidUpdate() {
        console.log("componentDidUpdate : ")

        console.log(this.props.favoritesFilm)
    }

    _displayLoading() {
        if (this.state.isLoading) {
            // Si isLoading vaut true, on affiche le chargement à l'écran
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }

    _toggleFavorite() {
        const action = {type: "TOGGLE_FAVORITE", value: this.state.film}
        this.props.dispatch(action)

    }

    _displayFilm() {
        console.log(this.state.film);
        if (this.state.film !== undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>

                    <Image
                        style={styles.image}
                        source={{uri: getImageFromApi(this.state.film.backdrop_path)}}
                    />

                    <Text style={styles.title_text}>
                        {this.state.film.title}
                    </Text>
                    <Text style={styles.favDetail}>
                        <Icon
                            style={styles.fav}
                            name={this.getFav()}
                            color="red"
                            size={30}
                            onPress={() => this._toggleFavorite()}
                        />
                    </Text>
                    <Text style={styles.description_text}>{this.state.film.overview}</Text>
                    <Text style={styles.default_text}>Sortie le
                        : {moment(new Date(this.state.film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {this.state.film.vote_average}</Text>
                    <Text style={styles.default_text}>Nombre de votes : {this.state.film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget
                        : {numeral(this.state.film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s)
                        : {this.state.film.genres.map((genre, index) => genre.name).join("/")}</Text>
                    <Text style={styles.default_text}>Companie(s)
                        : {this.state.film.production_companies.map((comp, index) => comp.name).join("/")}</Text>
                </ScrollView>
            )
        }
    }

    getFav() {
        return this.props.favoritesFilm.find(item => item.id === this.state.film.id) ? "heart" : "heart-outline";
    }

    render() {
        console.log(this.props)

        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}

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
        marginBottom: 5,
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
    favDetail: {
        textAlign: 'center'

    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}


export default connect(mapStateToProps)(FilmDetail)
