# Geographic Functions {#functions-geography}

Geographical functions operate on geographic input, like points, lines
or polygons. The built-in general-purpose geographic functions are
listed in [table_title](#functions-geography-table).

+-------------+-------------+-------------+-------------+-------------+
| Function    | Return Type | Description | Example[^4] | Result[^5]  |
+=============+=============+=============+=============+=============+
| `geo_ma     | `geogra     | Creates a   |             |             |
| ke_point(la | phy(point)` | point with  | geo_make_po |  point(30.0 |
| titude doub |             | coordinates | int(20, 30) | 000003 20.0 |
| le, longitu |             | `latitude`  |             | )Note that  |
| de double)` |             | and         |             | the latitud |
|             |             | `           |             | e and longi |
|             |             | longitude`. |             | tude are fl |
|             |             |             |             | ipped in th |
|             |             |             |             | e result, b |
|             |             |             |             | ecause it i |
|             |             |             |             | s shown in  |
|             |             |             |             | the WKT for |
|             |             |             |             | mat as poin |
|             |             |             |             | t(longitude |
|             |             |             |             |  latitude). |
+-------------+-------------+-------------+-------------+-------------+
| `geo_make_l | `           | Creates a   |     geo_mak |             |
| ine(a geogr | geography(l | line        | e_line('poi | linestring( |
| aphy(point) | inestring)` | between `a` | nt(14 42)': | 14.0000003  |
| , b geograp |             | and `b`     | :geography, | 42.0000002, |
| hy(point))` |             |             |             |             |
|             |             |             |        'poi |             |
|             |             |             | nt(18 43)': | 18.0000003  |
|             |             |             | :geography) | 43.0000001) |
+-------------+-------------+-------------+-------------+-------------+
| `           | `double`    | Distance in |     geo_    |     110.5   |
| geo_distanc |             | the WGS84   | distance('p | 74372592802 |
| e(a geograp |             | ellipsoid   | oint(0 0)': |             |
| hy(point),  |             | between     | :geography, |             |
| b geography |             | points `a`  |             |             |
| (point), un |             | and `b`     |          'p |             |
| it string)` |             | expressed   | oint(0 1)': |             |
|             |             | in `unit`.  | :geography, |             |
|             |             |             |             |             |
|             |             |             |          'k |             |
|             |             |             | ilometers') |             |
+-------------+-------------+-------------+-------------+-------------+
| `geo_buffer | `geograph   | 120-sided   |     geo_    |             |
| (p geograph | y(polygon)` | polygon     | buffer('poi |   polygon(( |
| y(point), r |             | around      | nt(90 45)': | 90.0000002  |
|  double, un |             | point `p`,  | :geography, | 45.0178973, |
| it string)` |             | which is    |             |             |
|             |             | fully       |     1989.0, |             |
|             |             | enclosed by |             | 89.9986795  |
|             |             | circle with |             | 45.0178727, |
|             |             | center in   |    'meter') |             |
|             |             | same point  |             |         ... |
|             |             | and radius  |             |             |
|             |             | `r`, where  |             |             |
|             |             | radius unit |             | 90.0013209  |
|             |             | is given in |             | 45.0178727, |
|             |             | `unit`.     |             |             |
|             |             | When radius |             |           9 |
|             |             | is 0, a     |             | 0.0000002 4 |
|             |             | single      |             | 5.0178973)) |
|             |             | point is    |             |             |
|             |             | returned    |             |             |
|             |             | (the input  |             |             |
|             |             | parameter)  |             |             |
|             |             | instead of  |             |             |
|             |             | a 120-sided |             |             |
|             |             | polygon     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `geo_       | `geography` | Inverts the |             |             |
| auto_vertex |             | vertex      | geo_auto_ve |    geometry |
| _order(arg  |             | order for   | rtex_order( | collection( |
| geography)` |             | all         |             |             |
|             |             | polygons if |      'geome |       polyg |
|             |             | they are    | trycollecti | on((0.0 0.0 |
|             |             | specified   | on(polygon( | ,2.0000003  |
|             |             | in an       | (0 0, 2 0,  | 0.0,0.0 4.0 |
|             |             | int         | 0 4, 0 0)), | ,0.0 0.0)), |
|             |             | erior-right |             |             |
|             |             | winding     |             |       polyg |
|             |             | order       |             | on((0.0 0.0 |
|             |             | assuming    |    polygon( | ,4.0 0.0,0. |
|             |             | flat earth  | (0 0, 0 2,  | 0 2.0000003 |
|             |             | to          | 4 0, 0 0)), | ,0.0 0.0)), |
|             |             | pology.[^6] |             |             |
|             |             |             |             |  point(0.0  |
|             |             |             |          po | 2.0000003)) |
|             |             |             | int(0 2))': |             |
|             |             |             | :geography) |             |
+-------------+-------------+-------------+-------------+-------------+
| `geo_in     | `geography` | Inverts the |     ge      |             |
| vert_vertex |             | vertex      | o_invert_ve |    geometry |
| _order(arg  |             | order of    | rtex_order( | collection( |
| geography)` |             | all         |             |             |
|             |             | polygons    |      'geome |       polyg |
|             |             |             | trycollecti | on((0.0 0.0 |
|             |             |             | on(polygon( | ,0.0 4.0,2. |
|             |             |             | (0 0, 2 0,  | 0000003 0.0 |
|             |             |             | 0 4, 0 0)), | ,0.0 0.0)), |
|             |             |             |             |             |
|             |             |             |             |       polyg |
|             |             |             |             | on((0.0 0.0 |
|             |             |             |    polygon( | ,4.0 0.0,0. |
|             |             |             | (0 0, 0 2,  | 0 2.0000003 |
|             |             |             | 4 0, 0 0)), | ,0.0 0.0)), |
|             |             |             |             |             |
|             |             |             |             |  point(0.0  |
|             |             |             |          po | 2.0000003)) |
|             |             |             | int(0 2))': |             |
|             |             |             | :geography) |             |
+-------------+-------------+-------------+-------------+-------------+

: Geography functions

All supported units of length are listed in
[table_title](#functions-geography-table-units).

  Unit name in American spelling   Other supported spellings               Description
  -------------------------------- --------------------------------------- -----------------------------------------------------------
  meter                            metre, m, meters, metres                Base unit of length in International System of Units (SI)
  kilometer                        kilometre, km, kilometers, kilometres   Equal to 1000 meters
  mile                             mi, miles                               Equal to 1609.344 meters
  foot                             ft, feet                                Equal to 0.3048 meters

  : Supported distance units

[^1]: To pass a `geography` constant as an argument, it needs to be cast
    from a string which contains a `geography` object formatted in the
    Well Known Text (WKT) format defined by the Open GIS Consortium,
    Inc, in the [OpenGIS Simple Features Specification For
    SQL](https://www.opengeospatial.org/standards/sfa). More examples of
    handling `geography` objects using the Hyper API can be found
    [here](https://help.tableau.com/current/api/hyper_api/en-us/docs/hyper_api_geodata.html).

[^2]: Return values of type `geography` are shown in WKT format

[^3]: Explicit use of `geo_auto_vertex_order` is needed and recommended
    only when processing extracts generated by Hyper API version
    v0.0.12514 or earlier. `geo_auto_vertex_order` is implicitly used
    when parsing `GEOGRAPHY` values from WKT format.

[^4]: To pass a `geography` constant as an argument, it needs to be cast
    from a string which contains a `geography` object formatted in the
    Well Known Text (WKT) format defined by the Open GIS Consortium,
    Inc, in the [OpenGIS Simple Features Specification For
    SQL](https://www.opengeospatial.org/standards/sfa). More examples of
    handling `geography` objects using the Hyper API can be found
    [here](https://help.tableau.com/current/api/hyper_api/en-us/docs/hyper_api_geodata.html).

[^5]: Return values of type `geography` are shown in WKT format

[^6]: Explicit use of `geo_auto_vertex_order` is needed and recommended
    only when processing extracts generated by Hyper API version
    v0.0.12514 or earlier. `geo_auto_vertex_order` is implicitly used
    when parsing `GEOGRAPHY` values from WKT format.
