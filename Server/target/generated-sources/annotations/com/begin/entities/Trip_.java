package com.begin.entities;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Trip.class)
public abstract class Trip_ {

	public static volatile SingularAttribute<Trip, String> description;
	public static volatile SingularAttribute<Trip, ZonedDateTime> startTime;
	public static volatile SingularAttribute<Trip, Long> Id;
	public static volatile SingularAttribute<Trip, ZonedDateTime> endTime;
	public static volatile SingularAttribute<Trip, Device> device;

}

