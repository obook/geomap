-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mer 03 Septembre 2014 à 00:41
-- Version du serveur: 5.5.38
-- Version de PHP: 5.4.4-14+deb7u14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `c1c1geowf`
--

-- --------------------------------------------------------

--
-- Structure de la table `geomap_history`
--

DROP TABLE IF EXISTS `geomap_history`;
CREATE TABLE IF NOT EXISTS `geomap_history` (
  `index` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL DEFAULT 'NEW',
  `active` int(10) unsigned NOT NULL DEFAULT '0',
  `mission` varchar(20) NOT NULL DEFAULT '1111',
  `cur_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip` varchar(25) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  `proxyip` varchar(25) NOT NULL,
  `proxyhostname` varchar(100) NOT NULL,
  `httpuseragent` varchar(255) NOT NULL,
  `userid` varchar(100) DEFAULT '',
  `state` float NOT NULL DEFAULT '0',
  `latitude` float NOT NULL DEFAULT '0',
  `longitude` float NOT NULL DEFAULT '0',
  `accuracy` float NOT NULL DEFAULT '0',
  `speed` float NOT NULL DEFAULT '0',
  `altitude` float NOT NULL,
  `altitudeAccuracy` float NOT NULL,
  `heading` float NOT NULL,
  `battery` int(11) NOT NULL,
  `time` double unsigned NOT NULL DEFAULT '0',
  `frequency` float NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8796093182210 ;

-- --------------------------------------------------------

--
-- Structure de la table `geomap_messages`
--

DROP TABLE IF EXISTS `geomap_messages`;
CREATE TABLE IF NOT EXISTS `geomap_messages` (
  `index` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL DEFAULT 'NEW',
  `active` int(10) unsigned NOT NULL DEFAULT '0',
  `mission` varchar(20) NOT NULL DEFAULT '1111',
  `cur_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip` varchar(25) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  `proxyip` varchar(25) NOT NULL,
  `proxyhostname` varchar(100) NOT NULL,
  `httpuseragent` varchar(255) NOT NULL,
  `userid` varchar(100) NOT NULL DEFAULT '',
  `message` longtext NOT NULL,
  `time` double unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`index`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=390 ;

-- --------------------------------------------------------

--
-- Structure de la table `geomap_system`
--

DROP TABLE IF EXISTS `geomap_system`;
CREATE TABLE IF NOT EXISTS `geomap_system` (
  `index` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cur_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `time` double unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`index`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=47613 ;

-- --------------------------------------------------------

--
-- Structure de la table `geomap_users`
--

DROP TABLE IF EXISTS `geomap_users`;
CREATE TABLE IF NOT EXISTS `geomap_users` (
  `index` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL DEFAULT 'NEW',
  `active` int(10) unsigned NOT NULL DEFAULT '0',
  `mission` varchar(20) NOT NULL DEFAULT '1111',
  `cur_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip` varchar(25) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  `proxyip` varchar(25) NOT NULL,
  `proxyhostname` varchar(100) NOT NULL,
  `httpuseragent` varchar(255) NOT NULL,
  `userid` varchar(100) DEFAULT '',
  `state` float NOT NULL DEFAULT '0',
  `latitude` float NOT NULL DEFAULT '0',
  `longitude` float NOT NULL DEFAULT '0',
  `accuracy` float NOT NULL DEFAULT '0',
  `speed` float NOT NULL DEFAULT '0',
  `altitude` float NOT NULL,
  `altitudeAccuracy` float NOT NULL,
  `heading` float NOT NULL,
  `battery` int(11) NOT NULL,
  `time` double unsigned NOT NULL DEFAULT '0',
  `frequency` float NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=403 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
