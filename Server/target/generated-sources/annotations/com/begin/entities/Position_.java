package com.begin.entities;

import java.time.ZonedDateTime;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Position.class)
public abstract class Position_ {

	public static volatile SingularAttribute<Position, Trip> trip;
	public static volatile SingularAttribute<Position, Long> latitude;
	public static volatile ListAttribute<Position, Value> incidentValues;
	public static volatile SingularAttribute<Position, Long> id;
	public static volatile SingularAttribute<Position, Device> device;
	public static volatile SingularAttribute<Position, Long> longitude;
	public static volatile SingularAttribute<Position, ZonedDateTime> timestamp;

}

