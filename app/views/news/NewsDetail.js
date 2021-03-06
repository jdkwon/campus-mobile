import React from 'react';
import {
	View,
	Text,
	ScrollView,
	Linking,
	TouchableHighlight,
	Dimensions,
} from 'react-native';
import moment from 'moment';

import SafeImage from '../common/SafeImage';
import css from '../../styles/css';
import logger from '../../util/logger';

const NewsDetail = ({ data }) => {
	logger.ga('View Loaded: News Detail: ' + data.title);

	return (
		<View style={[css.main_container, css.whitebg]}>
			<ScrollView contentContainerStyle={css.scroll_default}>

				{data.image_lg ? (
					<SafeImage
						source={{ uri: data.image_lg }}
						style={{
							width: Dimensions.get('window').width,
							height: 200
						}}
						resizeMode={'contain'}
					/>
				) : null }

				<View style={css.news_detail_container}>
					<View style={css.eventdetail_top_right_container}>
						<Text style={css.eventdetail_eventname}>{data.title}</Text>
						<Text style={css.eventdetail_eventdate}>
							{moment(data.date).format('MMM Do, YYYY')}
						</Text>
					</View>

					<Text style={css.eventdetail_eventdescription}>{data.description}</Text>

					{data.link ? (
						<TouchableHighlight underlayColor={'rgba(200,200,200,.1)'} onPress={() => Linking.openURL(data.link)}>
							<View style={css.eventdetail_readmore_container}>
								<Text style={css.eventdetail_readmore_text}>Read the full article</Text>
							</View>
						</TouchableHighlight>
					) : null }

				</View>

			</ScrollView>
		</View>
	);
};

export default NewsDetail;
