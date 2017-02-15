import React, { PropTypes } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	ListView,
	TouchableOpacity
} from 'react-native';

import ElevatedView from 'react-native-elevated-view';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Can't use until RNVI 4.0
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { getPRM, getMaxCardWidth } from '../../util/general';

const PRM = getPRM();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const historyDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const suggestions = [
	{
		name: 'Parking',
		icon: 'local-parking',
	},
	{
		name: 'Hydration',
		icon: 'local-drink',
	},
	{
		name: 'Dining',
		icon: 'local-dining',
	},
	{
		name: 'Market',
		icon: 'local-grocery-store',
	},
	{
		name: 'Parking',
		icon: 'local-parking',
	},
	{
		name: 'Hydration',
		icon: 'local-drink',
	},
];

const SearchSuggest = ({ onPress }) => (
	<ElevatedView
		style={styles.card_main}
		elevation={2}
	>
		<View style={styles.list_container}>
			<SearchHistoryList
				historyData={historyDataSource.cloneWithRows(suggestions)}
				onPress={onPress}
			/>
		</View>
	</ElevatedView>
);

const SearchHistoryList = ({ historyData, onPress }) => (
	<ListView
		showsVerticalScrollIndicator={false}
		showsHorizontalScrollIndicator={false}
		dataSource={historyData}
		horizontal={true}
		renderRow={
			(row, sectionID, rowID) =>
				<SearchHistoryItem
					data={row}
					onPress={onPress}
				/>
		}
	/>
);

// local-dining
// local-drink
// local-parking
// local-grocery-store

const SearchHistoryItem = ({ data, onPress }) => (
	<TouchableOpacity
		underlayColor={'rgba(200,200,200,.1)'}
		onPress={() => {
			onPress(data.name);
		}}
	>
		<View style={styles.list_row}>
			<ElevatedView
				style={styles.icon_container}
				elevation={3}
			>
				<MaterialIcon
					name={data.icon}
					size={Math.round(24 * PRM)}
					color={'white'}
				/>
			</ElevatedView>
		</View>
	</TouchableOpacity>
);

/*
<View
				style={styles.text_container}
			>
				<Text>{data.name}</Text>
			</View>*/

const styles = StyleSheet.create({
	list_container: { width: getMaxCardWidth(), paddingTop: 8, paddingBottom: 8, height: Math.round(deviceWidth / 4) },
	card_main: { top: Math.round(44 * getPRM()) + 6, backgroundColor: '#FFFFFF', margin: 6, alignItems: 'center', justifyContent: 'center',  },
	list_row: { flex: 1, alignItems: 'center', flexDirection: 'column', paddingVertical: 14, width: Math.round((deviceWidth - 12) / 4), },
	icon_container: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: '#db3236' },
	text_container: { flex: 0.9 }
});

export default SearchSuggest;
