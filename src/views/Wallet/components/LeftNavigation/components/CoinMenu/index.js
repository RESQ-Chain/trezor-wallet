/* @flow */

import styled from 'styled-components';
import coins from 'constants/coins';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Link, colors, icons as ICONS } from 'trezor-ui-components';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Divider from '../Divider';
import RowCoin from '../RowCoin';

import l10nMessages from './index.messages';

import type { Props } from '../common';

const Wrapper = styled.div``;

const ExternalWallet = styled.div`
    cursor: pointer;
`;

const StyledLink = styled(Link)`
    &:hover {
        text-decoration: none;
    }
`;

class CoinMenu extends PureComponent<Props> {
    getBaseUrl() {
        const { selectedDevice } = this.props.wallet;
        let baseUrl = '';
        if (selectedDevice && selectedDevice.features) {
            baseUrl = `/device/${selectedDevice.features.device_id}`;
            if (selectedDevice.instance) {
                baseUrl += `:${selectedDevice.instance}`;
            }
        }

        return baseUrl;
    }

    getOtherCoins() {
        return coins
            .sort((a, b) => a.order - b.order)
            .map(coin => {
                const row = (
                    <RowCoin
                        network={{
                            name: coin.coinName,
                            shortcut: coin.id,
                        }}
                        iconRight={{
                            type: ICONS.SKIP,
                            color: colors.TEXT_SECONDARY,
                            size: 13,
                        }}
                    />
                );

                if (coin.external)
                    return (
                        <ExternalWallet
                            key={coin.id}
                            onClick={() => this.props.gotoExternalWallet(coin.id, coin.url)}
                        >
                            {row}
                        </ExternalWallet>
                    );
                return (
                    <StyledLink isGray key={coin.id} href={coin.url} target="_top">
                        {row}
                    </StyledLink>
                );
            });
    }

    render() {
        const { config } = this.props.localStorage;
        return (
            <Wrapper data-test="Main__page__coin__menu">
                {config.networks
                    .sort((a, b) => a.order - b.order)
                    .map(item => (
                        <NavLink
                            key={item.shortcut}
                            to={`${this.getBaseUrl()}/network/${item.shortcut}/account/0`}
                        >
                            <RowCoin
                                network={{
                                    name: item.name,
                                    shortcut: item.shortcut,
                                }}
                            />
                        </NavLink>
                    ))}
                <Divider
                    testId="Main__page__coin__menu__divider"
                    textLeft={<FormattedMessage {...l10nMessages.TR_OTHER_COINS} />}
                    hasBorder
                />
                {this.getOtherCoins()}
            </Wrapper>
        );
    }
}

CoinMenu.propTypes = {
    localStorage: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    gotoExternalWallet: PropTypes.func.isRequired,
};

export default CoinMenu;
