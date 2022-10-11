# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2.1.0 - 2022-10-11

### Changed

- Enabled de-referencing of aliases. Believed it will resolve Error 0xa (10).
- Added exists check and logging around duplicate keys.

## 2.0.0 - 2022-10-11

### Changed

- Renamed config and environment variables to align with use
  - CLIENT_URL -> LDAP_URL
  - CLIENT_DOMAIN -> BASE_DN
  - CLIENT_USERNAME -> USERNAME
  - CLIENT_PASSWORD -> PASSWORD
- Updated jupiterone.md and development.md docs
- Updated `ldapts` package
- Changed LDAP user query

## 1.0.0 - 2022-04-26

### Added

Initial Microsoft Active Directory integration.

- Ingest new entity `ad_account`
- Ingest new entity `ad__user`
- Ingest new entity `ad_group`
- Ingest new entity `ad_device`

- Build new relationship `ad_account_has_user`
- Build new relationship `ad_account_has_group`
- Build new relationship `ad_account_has_device`
- Build new relationship `ad_group_has_user`
