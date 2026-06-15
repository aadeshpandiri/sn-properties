# Database Schema

## properties
id UUID
title
slug
description
listing_type
property_type
price
bedrooms
bathrooms
area
address
city
status
featured
availability_date

## property_images
id
property_id
image_url

## property_videos
id
property_id
video_url

## inquiries
id
property_id
name
email
phone
message

## schedule_visits
id
property_id
visitor_name
date
time

## testimonials
id
name
rating
review

## users
id
email
role