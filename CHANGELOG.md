# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
