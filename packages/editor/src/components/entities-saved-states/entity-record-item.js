/**
 * WordPress dependencies
 */
import { CheckboxControl, Button, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

export default function EntityRecordItem( {
	record,
	checked,
	onChange,
	closePanel,
} ) {
	const { name, kind, title, key } = record;
	const parentBlockId = useSelect(
		( select ) => {
			// Get entity's blocks.
			const { blocks = [] } = select( coreStore ).getEditedEntityRecord(
				kind,
				name,
				key
			);
			// Get parents of the entity's first block.
			const parents = select( blockEditorStore ).getBlockParents(
				blocks[ 0 ]?.clientId
			);
			// Return closest parent block's clientId.
			return parents[ parents.length - 1 ];
		},
		[ key, kind, name ]
	);

	// Handle templates that might use default descriptive titles.
	const entityRecordTitle = useSelect(
		( select ) => {
			if ( 'postType' !== kind || 'wp_template' !== name ) {
				return title;
			}

			const template = select( coreStore ).getEditedEntityRecord(
				kind,
				name,
				key
			);
			return select( editorStore ).__experimentalGetTemplateInfo(
				template
			).title;
		},
		[ name, kind, title, key ]
	);

	const isSelected = useSelect(
		( select ) => {
			const selectedBlockId =
				select( blockEditorStore ).getSelectedBlockClientId();
			return selectedBlockId === parentBlockId;
		},
		[ parentBlockId ]
	);
	const isSelectedText = isSelected ? __( 'Selected' ) : __( 'Select' );
	const { selectBlock } = useDispatch( blockEditorStore );

	return (
		<PanelRow>
			<CheckboxControl
				__nextHasNoMarginBottom
				label={
					<strong>
						{ decodeEntities( entityRecordTitle ) ||
							__( 'Untitled' ) }
					</strong>
				}
				checked={ checked }
				onChange={ onChange }
			/>
			{ parentBlockId ? (
				<>
					<Button
						className="entities-saved-states__find-entity"
						disabled={ isSelected }
						onClick={ () => selectBlock( parentBlockId ) }
					>
						{ isSelectedText }
					</Button>
					<Button
						className="entities-saved-states__find-entity-small"
						disabled={ isSelected }
						onClick={ () => {
							selectBlock( parentBlockId );
							closePanel();
						} }
					>
						{ isSelectedText }
					</Button>
				</>
			) : null }
		</PanelRow>
	);
}
