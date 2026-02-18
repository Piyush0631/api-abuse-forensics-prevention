# API Abuse Forensics & Prevention System

## Problem Statement
Modern APIs are vulnerable to abuse such as rate-limit attacks, token misuse,
parameter tampering, and Broken Object Level Authorization (BOLA). These attacks
often go undetected or lack proper forensic tracking.

## Objectives
- Detect API rate-limit abuse
- Identify token misuse across multiple IPs
- Prevent parameter tampering
- Detect BOLA attacks
- Classify different types of API abuse
- Generate attack timelines for forensic analysis
- Log security events for auditing

## Features
- Rate-limit abuse detection
- Token misuse detection
- Parameter tampering protection
- BOLA attack detection
- Rule-based attack classification
- Attack timeline generation
- Security event logging

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Redis
- JWT Authentication
- Winston Logger

## Project Scope
This project focuses on backend API security.
