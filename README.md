# Energy Dashboard Card

Initial technical foundation for the Solar Battery Economy Energy Dashboard.

## Current scope

- Lit custom card
- TypeScript + Rollup
- Home Assistant `hass` connection
- WebSocket call to `solar_battery_economy/get_dashboard_data`
- Basic payload verification

No dashboard business logic is implemented in the card.

The card consumes canonical data from Solar Battery Economy.
## Price semantics

The Energy Dashboard uses **total import price** as its displayed electricity price and for all household cost-related presentation. Export price remains separate revenue data. The raw normalized `spot` value remains available in the SBE data model but is not used as the dashboard display basis.
