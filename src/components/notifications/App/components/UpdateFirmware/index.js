/* @flow */
import * as React from 'react';
import { Notification } from 'trezor-ui-components';
import l10nCommonMessages from 'views/common.messages';
import { withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';
import { getPattern } from 'support/routes';
import type { Props } from '../../index';

import l10nMessages from './index.messages';

export default withRouter((props: Props & { location: any }) => {
    const { selectedDevice } = props.wallet;
    const outdated =
        selectedDevice && selectedDevice.features && selectedDevice.firmware === 'outdated';

    if (!outdated) return null;

    // don't show notification when user is on firmware update page
    if (matchPath(props.location.pathname, { path: getPattern('wallet-firmware-update') }))
        return null;

    return (
        <Notification
            key="update-firmware"
            type="warning"
            title={props.intl.formatMessage(l10nMessages.TR_NEW_TREZOR_FIRMWARE_IS_AVAILABLE_DOT)}
            message={props.intl.formatMessage(
                l10nCommonMessages.TR_UPGRADE_FOR_THE_NEWEST_FEATURES_DOT
            )}
            actions={[
                {
                    label: props.intl.formatMessage(l10nCommonMessages.TR_SHOW_DETAILS),
                    callback: props.routerActions.gotoFirmwareUpdate,
                },
            ]}
        />
    );
});
