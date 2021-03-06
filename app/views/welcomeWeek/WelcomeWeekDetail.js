import React from 'react';
import {
	View,
	Text,
	ScrollView,
	Image,
	Linking,
	TouchableHighlight,
	Dimensions
} from 'react-native';

const WebWrapper = require('../WebWrapper');

const windowSize = Dimensions.get('window');
const windowWidth = windowSize.width;

const css = require('../../styles/css');
const logger = require('../../util/logger');

export default class WelcomeWeekDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			eventImageWidth: null,
			eventImageHeight: null,
			eventImageURL: null,
		};
	}

	componentWillMount() {
		const imageURL = (this.props.route.eventData.EventImageLg) ? this.props.route.eventData.EventImageLg : this.props.route.eventData.EventImage;

		if (imageURL) {
			Image.getSize(
				imageURL,
				(width, height) => {
					this.setState({
						eventImageURL: imageURL,
						eventImageWidth: windowWidth,
						eventImageHeight: Math.round(height * (windowWidth / width))
					});
				},
				(error) => { logger.log('ERR: componentWillMount: ' + error); }
			);
		}
	}

	_renderScene() {
		const eventTitleStr = this.props.route.eventData.EventTitle.replace('&amp;','&');
		const eventDescriptionStr = this.props.route.eventData.EventDescription.replace('&amp;','&').trim();
		let eventDateStr = '';
		const eventDateArray = this.props.route.eventData.EventDate;

		if (eventDateArray) {
			for (let i = 0; eventDateArray.length > i; i++) {
				eventDateStr += eventDateArray[i].replace(/AM/g,'am').replace(/PM/g,'pm');
				if (eventDateArray.length !== i + 1) {
					eventDateStr += '\n';
				}
			}
		} else {
			eventDateStr = 'Ongoing Event';
		}

		return (
			<View style={[css.main_container, css.whitebg]}>
				<ScrollView contentContainerStyle={css.scroll_default}>

					{this.state.eventImageURL ? (
						<Image style={{ width: this.state.eventImageWidth, height: this.state.eventImageHeight }} source={{ uri: this.state.eventImageURL }} />
					) : null }

					<View style={css.news_detail_container}>
						<View style={css.eventdetail_top_right_container}>
							<Text style={css.eventdetail_eventname}>{eventTitleStr}</Text>
							<Text style={css.eventdetail_eventlocation}>{this.props.route.eventData.EventLocation}</Text>
							<Text style={css.eventdetail_eventdate}>{eventDateStr}</Text>
						</View>

						<Text style={css.eventdetail_eventdescription}>{eventDescriptionStr}</Text>

						{this.props.route.eventData.EventContact ? (
							<TouchableHighlight underlayColor={'rgba(200,200,200,.1)'} onPress={() => this.openBrowserLink('mailto:' + this.props.route.eventData.EventContact)}>
								<View style={css.eventdetail_readmore_container}>
									<Text style={css.eventdetail_readmore_text}>Email: {this.props.route.eventData.EventContact}</Text>
								</View>
							</TouchableHighlight>
						) : null }

					</View>
				</ScrollView>
			</View>
		);
	}

	_openBrowserLink(linkURL) {
		Linking.openURL(linkURL);
	}

	_gotoWebView(eventName, eventURL) {
		this.props.navigator.push({ id: 'WebWrapper', name: 'WebWrapper', title: eventName, component: WebWrapper, webViewURL: eventURL });
	}

	render() {
		return this._renderScene();
	}
}
