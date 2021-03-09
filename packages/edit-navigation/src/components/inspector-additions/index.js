/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AutoAddPagesPanel from './auto-add-pages-panel';
import DeleteMenuPanel from './delete-menu-panel';
import ManageLocations from './manage-locations';
import { NameEditor } from '../name-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function InspectorAdditions( {
	menuId,
	onDeleteMenu,
	onSelectMenu,
	isManageLocationsModalOpen,
	closeManageLocationsModal,
	openManageLocationsModal,
} ) {
	const selectedBlock = useSelect(
		( select ) => select( 'core/block-editor' ).getSelectedBlock(),
		[]
	);

	if ( selectedBlock?.name !== 'core/navigation' ) {
		return null;
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Theme Locations' ) }>
				<ManageLocations
					onSelectMenu={ onSelectMenu }
					isModalOpen={ isManageLocationsModalOpen }
					closeModal={ closeManageLocationsModal }
					openModal={ openManageLocationsModal }
				/>
			</PanelBody>
			<PanelBody title={ __( 'Menu Settings' ) }>
				<NameEditor />
				<AutoAddPagesPanel menuId={ menuId } />
				<DeleteMenuPanel onDeleteMenu={ onDeleteMenu } />
			</PanelBody>
		</InspectorControls>
	);
}
