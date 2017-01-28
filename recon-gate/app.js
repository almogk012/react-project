import React from 'react';
import ReactDOM from 'react-dom';
var Node = require('react-if-comp');

var FoxMovies = React.createClass({

    loadData: function () {
        var component = this;
        $.getJSON('./data/movies.json', function (data) {
            component.setState({data: data});
        });
    },
    getInitialState: function () {
        return {data: {movies: []}};
    },
    componentDidMount: function () {
        this.loadData();
    },

    render: function () {
        return (
            <div className="FoxMovies">
                <Galleries data={this.state.data}/>
            </div>
        )
    }
});

var Galleries = React.createClass({
    getInitialState: function () {
        return {
            upGallery: {},
            downGallery: {},
            imageNumber: 0,
            imageWidthUpGallery: '',
            imageWidthDownGallery: '',
            currentImage: 0,
            currentPositionUp: 0,
            currentPositionDown: 0,
            galleryItems: 0,
            centerScreen: 0,
            centerScreenDownGallery: 0
        };
    },
    componentDidUpdate: function () {
        //   up gallery
        this.state.upGallery = document.getElementById('upGallery');
        this.state.imageNumber = this.state.upGallery.childNodes.length; // same images number in up and down gallery
        this.state.imageWidthUpGallery = this.state.upGallery.children[0].clientWidth;
        this.state.upGallery.style.width = this.state.imageWidthUpGallery * this.state.imageNumber + 'px';

        // down gallery
        this.state.downGallery = document.getElementById('downGallery');
        this.state.imageWidthDownGallery = this.state.downGallery.children[0].clientWidth;
        this.state.centerScreen = (window.innerWidth / 2) - (this.state.downGallery.children[0].clientWidth / 2);
        this.state.centerScreenDownGallery = this.state.centerScreen + 'px';
        this.state.downGallery.style.left = this.state.centerScreenDownGallery;
        this.state.downGallery.style.width = this.state.centerScreen + this.state.downGallery.clientWidth + 'px';
    },

    slideTo: function (imageToGo) {
        var component = this;
        var direction;
        var numOfImageToGo = Math.abs(imageToGo - component.state.currentImage);
        direction = component.state.currentImage > imageToGo ? 1 : -1;
        component.state.currentPostionUp = -1 * component.state.currentImage * component.state.imageWidthUpGallery;
        component.state.currentPostionDown = -1 * component.state.currentImage * component.state.imageWidthDownGallery;

        var opts = {
            duration: 1000,
            delta: function (p) {
                return p;
            },
            step: function (delta) {
                component.state.upGallery.style.left =
                    parseInt(component.state.currentPostionUp + direction * delta * component.state.imageWidthUpGallery * numOfImageToGo) + 'px';
                if (delta == 1) {
                    component.state.downGallery.style.left = parseFloat(component.state.centerScreenDownGallery.replace('px', '')) - ((imageToGo) * 300) + 'px';
                }
            },
            callback: function () {
                component.state.currentImage = imageToGo;
            }
        };
        this.animate(opts);
    },
    animate: function (opts) {
        var start = new Date;
        var id = setInterval(function () {
            var timePassed = new Date - start;
            var progress = timePassed / opts.duration;
            if (progress > 1) {
                progress = 1;
            }
            var delta = opts.delta(progress);
            opts.step(delta);
            if (progress == 1) {
                clearInterval(id);
                opts.callback();
            }
        }, opts.delay || 17);
    },

    prev: function () {
        if (this.state.currentImage == 0) {
            this.slideTo(this.state.imageNumber - 1);
        }
        else {
            this.slideTo(this.state.currentImage - 1);
        }
    },
    next: function () {
        if (this.state.currentImage == this.state.imageNumber - 1) {
            this.slideTo(0);
        }
        else {
            this.slideTo(this.state.currentImage + 1);
        }
    },
    goTo: function (id) {
        this.slideTo(id);
    },

    render: function () {
        var component = this;
        var upGalleryStyle = {
            height: 574
        };
        var upGallery = this.props.data.movies.map(function (movie) {
            return (<li className="image-up-gallery" key={movie.id} style={{
                    backgroundImage: "url(" + movie.image + ")",
                    width: window.innerWidth + 'px',
                    height: 574 + 'px'
                }}>
                    <div className="leftArrow" onClick={() => component.prev()}><span id="leftA"></span></div>
                    <a href={movie.options[2]} target="_blank" className="linkChild">
                        <div className="info">
                            <h1 id="title">{movie.title}<span></span></h1><h2 id="date">{movie.date}</h2>
                        </div>
                    </a>
                    <div className="rightArrow" onClick={() => component.next()}><span id="rightA"></span></div>
                    <ul className="links">
                        <li>
                            <Node if={movie.options[0] != null}>
                                <Node then>
                                    <a href={movie.options[0]} target="_blank" className="linkChild">
                                        <span className="left">GET TICKETS NOW</span>
                                        <span className="right"><span></span></span>
                                    </a>
                                </Node>
                            </Node>
                        </li>
                        <li>
                            <Node if={movie.options[1] != null}>
                                <Node then>
                                    <a href={movie.options[1]} target="_blank" className="linkChild">
                                        <span className="left">WATCH THE TRAILER</span>
                                        <span className="right"><span></span></span>
                                    </a>
                                </Node>
                            </Node>
                        </li>
                        <li>
                            <Node if={movie.options[2] != null}>
                                <Node then>
                                    <a href={movie.options[2]} target="_blank" className="linkChild">
                                        <span className="left">VISIT OFFICAIL SITE</span>
                                        <span className="right"><span></span></span>
                                    </a>
                                </Node>
                            </Node>
                        </li>
                    </ul>
                </li>
            )
        });

        var downGallery = this.props.data.movies.map(function (movie) {
            return (<li className="image-down-gallery" key={movie.id} onClick={() => component.goTo(movie.id)}>
                    <img src={ movie.smallImage }></img>
                    <div className="infoDownGallery"><span>{movie.date}</span><h4>{movie.title}</h4></div>
                </li>
            )
        });
        return (
            <div id="content">
                <div className="container">
                    <div className="main">
                        <ul id="upGallery" className="List" style={upGalleryStyle}>{upGallery}</ul>
                        <div className="pointer">
                            <div className="left-triangle"></div>
                            <div className="right-triangle"></div>
                        </div>
                    </div>
                </div>
                <div className="containerDown">
                    <div className="mainDown">
                        <ul id="downGallery" className="List">{downGallery}</ul>
                    </div>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <FoxMovies/>, document.getElementById('root')
);



