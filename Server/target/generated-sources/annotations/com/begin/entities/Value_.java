package com.begin.entities;

import com.begin.entities.Value.Metric;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Value.class)
public abstract class Value_ {

	public static volatile SingularAttribute<Value, String> unit;
	public static volatile SingularAttribute<Value, Metric> metric;
	public static volatile SingularAttribute<Value, Long> id;
	public static volatile SingularAttribute<Value, Double> value;

}

