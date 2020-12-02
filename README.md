# Bilkent Scheduler

[Bilkent Scheduler](https://www.bilkentscheduler.com/) is a visualizer that makes Bilkent University students' lives easier during course registration. 

## Table of Contents

- [Project Structure](#project-structure)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [License](#license)

## Project Structure

Bilkent Scheduler consists of two main parts; data scraper and visualizer.

### Data Scraper

Data scraper part is responsible from ensuring that the application data is up to date. The scraping function runs each an every day at 5:00 AM (GMT+3); it scrapes the necessary data from [Bilkent Stars](https://stars.bilkent.edu.tr/), and commits the new/updated application data to GitHub repo.

### Visualizer

Visualizer part is responsible from calculating and visualising all of the possible weekly schedules that result from selected courses. 

## Project Architecture

Both data scraper and visualizer runs on Firebase (Firebase Hosting, Firebase Functions). When a new commit is pushed to master, the continuous deployment pipelines that are created by using GitHub actions handle the deployment processes.

## Features

- Instructor selection
- Timeslot preservation
- Schedule exporter

## License

[MIT](LICENSE)
