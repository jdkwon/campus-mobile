/**
 * View for Welcome Week events
 * Triggered by onPress from Special Events Card in Home.js
**/

import React, { Component } from 'react';
import {
	ListView,
	Text,
	View,
	TouchableOpacity,
	Image,
	InteractionManager,
	RefreshControl,
	ActivityIndicator,
} from 'react-native';

import WelcomeWeekService from '../../services/welcomeWeekService';
import EventDetail from '../events/EventDetail';
import css from '../../styles/css';

const logger = require('../../util/logger');

const collegeNames = [
	{ name: 'Roosevelt' },
	{ name: 'Marshall' },
	{ name: 'Muir' },
	{ name: 'Revelle' },
	{ name: 'Sixth' },
	{ name: 'Warren' },
	{ name: 'Village' },
];

export default class WelcomeWeekView extends Component {
	constructor(props) {
		super(props);

		this.fetchErrorInterval = 15 * 1000;			// Retry every 15 seconds
		this.fetchErrorLimit = 3;
		this.fetchErrorCounter = 0;

		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];

		const getRowData = (dataBlob, sectionID, rowID) => dataBlob[sectionID + ':' + rowID];

		this.state = {
			welcomeWeekData: {},
			fetchErrorLimitReached: false,

			loaded : false,
			refreshing: false,
			dataSource : new ListView.DataSource({
				getSectionData,
				getRowData,
				rowHasChanged : (row1, row2) => row1 !== row2,
				sectionHeaderHasChanged : (s1, s2) => s1 !== s2
			})
		};
	}

	componentWillMount() {

	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this._fetchData();
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		logger.log('shouldComponentUpdate WelcomeView');
		return true;
	}

	componentWillUnmount() {

	}

	gotoEventDetail(eventData) {
		this.props.navigator.push({ id: 'EventDetail', name: 'EventDetail', title: 'Event', component: EventDetail, eventData });
	}

	_fetchData = () => {
		this.setState({ refreshing: true });

		// Fetch data from API
		WelcomeWeekService.FetchEvents()
		.then((responseData) => {
			const dataBlob = {},
				sectionIDs = [],
				rowIDs = [];
			let college,
				i,
				j;

			// Loop through each college
			for (i = 0; i < collegeNames.length; i++) {
				college = collegeNames[i];

				sectionIDs.push(college.name);
				dataBlob[college.name] = college.name;
				rowIDs[i] = [];

				// Loop through remaining events
				for (j = 0; j < responseData.length; ++j) {
					// Remove event from responses
					// Add to row data
					if (responseData[j].EventCollege === college.name) {
						rowIDs[i].push(responseData[j].wtsEventID);
						dataBlob[college.name + ':' + responseData[j].wtsEventID] = responseData.splice(j, 1)[0];
						--j;
					}
				}
			}

			this.setState({
				dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
				loaded: true,
				refreshing: false,
			});
		})
		.catch((error) => {
			logger.error(error);
			if (this.fetchErrorLimit > this.fetchErrorCounter) {
				this.fetchErrorCounter++;
				logger.log('ERR: fetchTopStories: refreshing again in ' + (this.fetchErrorInterval / 1000) + ' sec');
				this.refreshTimer = setTimeout( () => { this.refresh(); }, this.fetchErrorInterval);
			} else {
				logger.log('ERR: fetchTopStories: Limit exceeded - max limit:' + this.fetchErrorLimit);
				this.setState({ fetchErrorLimitReached: true });
			}
		});
	}

	_renderRow = (rowData, sectionID, rowID) => {
		let description = 	rowData.EventDescription;
		const title = 		rowData.EventTitle,
			image = 		rowData.EventImage,
			date = 			rowData.EventDate;

		description = description.replace(/\?.*/g,'?').replace(/!.*/g,'!').replace(/\..*/g,'.').replace(/\(.*/g,'');

		if (date[0] === 'NA') {
			return (
				<View style={css.welcome_list_row}>
					<View style={css.welcome_list_left_container}>
						<Text style={css.welcome_list_title}>{title}</Text>
						<Text style={css.welcome_list_desc}>{description}</Text>
					</View>
					<Image style={css.events_list_image} source={{ uri: image }} />
				</View>
			);
		} else {
			return (
				<TouchableOpacity underlayColor={'rgba(200,200,200,.1)'} onPress={() => this.gotoEventDetail(rowData)}>
					<View style={css.welcome_list_row}>
						<View style={css.welcome_list_left_container}>
							<Text style={css.welcome_list_title}>{title}</Text>
							<Text style={css.welcome_list_desc}>{description}</Text>
							<Text style={css.welcome_list_postdate}>{date}</Text>
						</View>
						<Image style={css.events_list_image} source={{ uri: image }} />
					</View>
				</TouchableOpacity>
			);
		}
	}

	_renderSectionHeader = (sectionData, sectionID) =>
		<View style={css.welcome_list_section}>
			<Text style={css.welcome_list_sectionText}>{sectionData}</Text>
		</View>

	renderLoadingView = () =>
		<View style={css.main_container}>
			<ActivityIndicator
				animating={this.state.animating}
				style={css.welcome_ai}
				size="large"
			/>
		</View>

	renderListView() {
		return (
			<View style={css.main_container}>
				<ListView
					style={css.welcome_listview}
					dataSource={this.state.dataSource}
					renderRow={this._renderRow}
					renderSectionHeader={this._renderSectionHeader}
					enableEmptySections={true}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._fetchData}
						/>
					}
				/>
			</View>
		);
	}

	render() {
		if (!this.state.loaded) {
			return this.renderLoadingView();
		}
		return this.renderListView();
	}
}
